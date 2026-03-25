import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">
            BagHub Admin
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-gray-300">
              View Store
            </Link>
            <Link href="/account" className="hover:text-gray-300">
              Account
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-64px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/customers"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/analytics"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}