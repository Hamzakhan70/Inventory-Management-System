import { paymentsApi } from "@/app/lib/api/payments";
import Link from "next/link";


export default async function PaymentsPage() {
  const payments = await paymentsApi.getAll();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left">ID</th>
            <th className="py-2 px-4 text-left">Order</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Method</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Created At</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any) => (
            <tr key={payment.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{payment.id}</td>
              <td className="py-2 px-4">#{payment.orderId}</td>
              <td className="py-2 px-4">${payment.amount}</td>
              <td className="py-2 px-4">{payment.method}</td>
              <td
                className={`py-2 px-4 font-medium ${
                  payment.status === "SUCCESS"
                    ? "text-green-600"
                    : payment.status === "FAILED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {payment.status}
              </td>
              <td className="py-2 px-4">
                {new Date(payment.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-4 text-center">
                <Link
                  href={`/admin/payments/${payment.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
