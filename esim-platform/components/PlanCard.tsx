import Link from 'next/link'
import { Plan } from '@/types'

interface PlanCardProps {
  plan: Plan
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            {plan.region}
          </span>
          <span className="text-2xl">🌍</span>
        </div>
        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
        <p className="text-white/80 text-sm">{plan.country}</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-baseline mb-2">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
            <span className="ml-2 text-gray-500">/{plan.validity_days} days</span>
          </div>
          <div className="text-blue-600 font-semibold text-lg">{plan.data_amount} Data</div>
        </div>

        {plan.description && (
          <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
        )}

        <ul className="space-y-3 mb-6">
          {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={`/plans/${plan.id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          Buy Now
        </Link>
      </div>
    </div>
  )
}
