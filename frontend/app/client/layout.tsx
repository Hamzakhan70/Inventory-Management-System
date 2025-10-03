"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Package, CreditCard, RotateCcw } from "lucide-react";
import { CartProvider, useCart } from "@/context/CartContext";

function ClientLayoutContent({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart } = useCart();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-md flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-50 h-full`}>
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
          <span className="text-blue-600">Client Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/client/products" 
            className="flex items-center px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link 
            href="/client/cart" 
            className="flex items-center px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Cart
            {cartItemCount > 0 && (
              <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link 
            href="/client/checkout" 
            className="flex items-center px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Checkout
          </Link>
          <Link 
            href="/client/refund" 
            className="flex items-center px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Refunds
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-4">
          <button 
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold">Client Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link 
              href="/client/cart" 
              className="relative p-2 rounded hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-600">Client</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </CartProvider>
  );
}
