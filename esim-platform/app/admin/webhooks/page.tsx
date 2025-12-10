import { createClient } from '@/lib/supabase/server'

export default async function AdminWebhooksPage() {
  const supabase = await createClient()

  const { data: webhooks } = await supabase
    .from('webhook_logs')
    .select('*')
    .order('processed_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Webhook Logs</h1>
        <p className="text-gray-600 mt-1">Monitor Stripe webhook events</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {webhooks && webhooks.length > 0 ? (
                webhooks.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {webhook.event_type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        webhook.status === 'processed' ? 'bg-green-100 text-green-700' :
                        webhook.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        webhook.status === 'received' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {webhook.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {webhook.error_message || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(webhook.processed_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No webhook logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
