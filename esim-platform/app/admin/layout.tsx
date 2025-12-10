import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (!adminUser) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen text-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          <nav className="px-4 space-y-1">
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Orders
            </Link>
            <Link
              href="/admin/plans"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Plans
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Users
            </Link>
            <Link
              href="/admin/payments"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Payments
            </Link>
            <Link
              href="/admin/webhooks"
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Webhooks
            </Link>
            <div className="pt-4 border-t border-gray-800 mt-4">
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Back to Site
              </Link>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
