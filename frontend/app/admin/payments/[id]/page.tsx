import { paymentsApi } from "@/app/lib/api/payments";



export default async function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const payment = await paymentsApi.getById(Number(params.id));

  if (!payment) {
    return <p className="p-4">Payment not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment #{payment.id}</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Order:</strong> #{payment.orderId}</p>
        <p><strong>Amount:</strong> ${payment.amount}</p>
        <p><strong>Status:</strong> {payment.status}</p>
        <p><strong>Method:</strong> {payment.method}</p>
        <p><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
      </div>

      {/* Stripe Info */}
      {payment.method === "STRIPE" && (
        <div className="border p-4 rounded bg-gray-50 mb-6">
          <h2 className="text-lg font-semibold mb-2">Stripe Details</h2>
          <p><strong>Session ID:</strong> {payment.stripeSessionId || "N/A"}</p>
          <p><strong>Payment Intent:</strong> {payment.stripePaymentIntentId || "N/A"}</p>
        </div>
      )}

      {/* Refund Info */}
      {payment.refund && (
        <div className="border p-4 rounded bg-red-50">
          <h2 className="text-lg font-semibold mb-2">Refund</h2>
          <p><strong>Refund ID:</strong> {payment.refund.id}</p>
          <p><strong>Amount:</strong> ${payment.refund.amount}</p>
          <p><strong>Status:</strong> {payment.refund.status}</p>
          <p><strong>Reason:</strong> {payment.refund.reason || "N/A"}</p>
          <p><strong>Created At:</strong> {new Date(payment.refund.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
