"use client";

import { useEffect, useState } from "react";
import { ordersApi } from './../../lib/api/orders';
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    ordersApi.getAll()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    await ordersApi.delete(id);
    fetchOrders();
  };

  if (loading) return <p className="p-4">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border p-2">{o.id}</td>
              <td className="border p-2">{o.customer.name || "N/A"}</td>
              <td className="border p-2">${o.total}</td>
              <td className="border p-2">{o.status}</td>
              <td className="border p-2">
                {new Date(o.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                //   onClick={() => alert("Show order details soon")}
                >
                  <Link
                  href={`/admin/orders/${o.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  View
                </Link>
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
