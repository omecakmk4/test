import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { planId, customerEmail, customerName } = await request.json()

    if (!planId || !customerEmail) {
      return NextResponse.json(
        { error: 'Plan ID and customer email are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const session = await createCheckoutSession({
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      userId: user?.id,
      customerEmail,
    })

    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        plan_id: plan.id,
        status: 'pending',
        total_amount: plan.price,
        currency: plan.currency,
        stripe_checkout_session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerName || null,
      })
      .select()
      .single()

    return NextResponse.json({
      sessionId: session.id,
      orderId: order?.id,
    })
  } catch (error) {
    console.error('Checkout session creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
