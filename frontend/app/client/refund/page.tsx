"use client";
import { useEffect, useState } from "react";
import {refundApi} from '../api/refundApi'; // Adjust the import path as necessary

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refundApi.getRefunds()
      .then((data) => setRefunds(data))
      .catch((err) => console.error("Failed to load refunds", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading refunds...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Refunds</h1>
      {refunds.length === 0 ? (
        <p>No refund requests found.</p>
      ) : (
        <ul className="space-y-4">
          {refunds.map((refund) => (
            <li
              key={refund.id}
              className="p-4 border rounded shadow flex justify-between"
            >
              <span>Order #{refund.payment?.orderId}</span>
              <span>Status: {refund.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
