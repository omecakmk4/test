import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function EsimsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: esims } = await supabase
    .from('esim_details')
    .select('*, order:orders(*, plan:plans(*))')
    .eq('order.user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My eSIMs</h1>
        <p className="text-gray-600 mt-1">Access your eSIM QR codes and activation details</p>
      </div>

      <div className="space-y-6">
        {esims && esims.length > 0 ? (
          esims.map((esim) => (
            <div key={esim.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                        Scan to Install
                      </h3>
                      <div className="flex justify-center">
                        <img
                          src={esim.qr_code_data}
                          alt="eSIM QR Code"
                          className="w-64 h-64 border-4 border-blue-600 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {esim.order?.plan?.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {esim.order?.plan?.country} - {esim.order?.plan?.data_amount}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">SM-DP+ Address</p>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {esim.smdp_address}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700">Activation Code</p>
                        <p className="text-gray-900 font-mono text-sm break-all mt-1">
                          {esim.activation_code}
                        </p>
                      </div>

                      {esim.iccid && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700">ICCID</p>
                          <p className="text-gray-900 font-mono text-sm mt-1">
                            {esim.iccid}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-gray-700">Status</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                          esim.status === 'active' ? 'bg-green-100 text-green-700' :
                          esim.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                          esim.status === 'expired' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {esim.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Installation Instructions</h4>
                      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                        <li>Go to Settings on your device</li>
                        <li>Select Cellular or Mobile Data</li>
                        <li>Tap Add eSIM or Add Cellular Plan</li>
                        <li>Scan the QR code above or enter details manually</li>
                        <li>Follow on-screen instructions to complete setup</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">You don't have any eSIMs yet</p>
            <a
              href="/plans"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Plans
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
