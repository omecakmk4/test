import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { constructWebhookEvent } from '@/lib/stripe'
import { generateEsim } from '@/lib/esim'
import { sendOrderConfirmationEmail, sendEsimActivationEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = await constructWebhookEvent(body, signature)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase.from('webhook_logs').insert({
    event_type: event.type,
    payload: event.data.object,
    status: 'received',
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const { data: order } = await supabase
          .from('orders')
          .select('*, plan:plans(*)')
          .eq('stripe_checkout_session_id', session.id)
          .single()

        if (order) {
          await supabase
            .from('orders')
            .update({
              status: 'processing',
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', order.id)

          await supabase.from('payments').insert({
            order_id: order.id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: order.total_amount,
            currency: order.currency,
            status: 'processing',
            stripe_customer_id: session.customer as string,
          })

          await sendOrderConfirmationEmail({
            to: order.customer_email,
            customerName: order.customer_name || 'Customer',
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            planName: order.plan.name,
            amount: order.total_amount,
            currency: order.currency,
          })
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        const { data: payment } = await supabase
          .from('payments')
          .select('*, order:orders(*, plan:plans(*))')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single()

        if (payment) {
          await supabase
            .from('payments')
            .update({ status: 'succeeded' })
            .eq('id', payment.id)

          await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', payment.order_id)

          const esimData = await generateEsim({
            orderId: payment.order.id,
            planName: payment.order.plan.name,
            country: payment.order.plan.country,
          })

          await supabase.from('esim_details').insert({
            order_id: payment.order.id,
            qr_code_data: esimData.qrCodeData,
            smdp_address: esimData.smdpAddress,
            activation_code: esimData.activationCode,
            iccid: esimData.iccid,
            status: 'inactive',
          })

          await sendEsimActivationEmail({
            to: payment.order.customer_email,
            customerName: payment.order.customer_name || 'Customer',
            qrCodeData: esimData.qrCodeData,
            smdpAddress: esimData.smdpAddress,
            activationCode: esimData.activationCode,
            planName: payment.order.plan.name,
          })
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        await supabase
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
        break
      }
    }

    await supabase
      .from('webhook_logs')
      .update({ status: 'processed' })
      .eq('event_type', event.type)
      .order('processed_at', { ascending: false })
      .limit(1)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)

    await supabase
      .from('webhook_logs')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('event_type', event.type)
      .order('processed_at', { ascending: false })
      .limit(1)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
