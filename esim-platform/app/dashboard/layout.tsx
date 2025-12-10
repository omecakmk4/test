import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  My Orders
                </Link>
                <Link
                  href="/dashboard/esims"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  My eSIMs
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
