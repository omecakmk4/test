'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Plan } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    fetchPlan()
  }, [params.id])

  const fetchPlan = async () => {
    try {
      const response = await fetch('/api/plans')
      const data = await response.json()
      const foundPlan = data.plans.find((p: Plan) => p.id === params.id)
      setPlan(foundPlan || null)
    } catch (error) {
      console.error('Failed to fetch plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!plan || !customerEmail) return

    setPurchasing(true)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          customerEmail,
          customerName,
        }),
      })

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe && sessionId) {
        const result = await (stripe as any).redirectToCheckout({ sessionId })
        if (result?.error) {
          throw result.error
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading plan details...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h1>
          <button
            onClick={() => router.push('/plans')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Plans
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
                  {plan.region}
                </span>
                <span className="text-4xl">🌍</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{plan.name}</h1>
              <p className="text-white/90 text-lg">{plan.country}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="ml-2 text-white/80">/{plan.validity_days} days</span>
              </div>
              <div className="mt-2 text-xl font-semibold">{plan.data_amount} Data</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Features</h2>
              <ul className="space-y-4">
                {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase eSIM</h2>

              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    eSIM QR code will be sent to this email
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Plan Price</span>
                    <span className="text-xl font-bold text-gray-900">${plan.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600">Currency</span>
                    <span className="text-gray-900">{plan.currency}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {purchasing ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Secure payment powered by Stripe
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
