// app/admin/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-200">
            Products
          </Link>
          <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-200">
            Orders
          </Link>
          <Link href="/admin/payments" className="block px-3 py-2 rounded hover:bg-gray-200">
            Payments
          </Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-200">
            Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-4">
          <button className="md:hidden p-2 rounded hover:bg-gray-100">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin</span>
            <button className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
