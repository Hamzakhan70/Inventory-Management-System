"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ordersApi } from "@/app/lib/api/orders";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ordersApi.getById(id)
        .then(setOrder)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="p-4">Loading order...</p>;
  if (!order) return <p className="p-4">Order not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

      <p><strong>Customer:</strong> {order.customer.name}</p>
      <p><strong>Email:</strong> {order.customer.email}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Product</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2">${item.price}</td>
              <td className="border p-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
