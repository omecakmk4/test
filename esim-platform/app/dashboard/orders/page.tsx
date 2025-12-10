import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, plan:plans(*), esim_details(*)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">View and manage your eSIM orders</p>
      </div>

      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{order.plan?.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Order ID: {order.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">${order.total_amount}</p>
                    <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Country: <span className="text-gray-900">{order.plan?.country}</span></p>
                      <p className="text-gray-600">Data: <span className="text-gray-900">{order.plan?.data_amount}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Validity: <span className="text-gray-900">{order.plan?.validity_days} days</span></p>
                      <p className="text-gray-600">Email: <span className="text-gray-900">{order.customer_email}</span></p>
                    </div>
                  </div>
                </div>

                {order.status === 'completed' && order.esim_details && order.esim_details.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link
                      href={`/dashboard/esims?order=${order.id}`}
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View eSIM Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <Link
              href="/plans"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
