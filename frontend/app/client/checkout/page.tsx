"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { orderApi } from "../api/orderApi";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // ✅ Create Order in backend
      const order = await orderApi.createOrder({
        customerId: 1, // placeholder (later from auth)
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // ✅ Create Stripe session
      const session = await orderApi.createStripeSession(order.data.id);

      clearCart(); // empty cart after order created

      // ✅ Redirect to Stripe
      if (session.data.url) {
        window.location.href = session.data.url;
      }
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty. Please add products first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border p-4 rounded">
            <div>
              <h2 className="text-xl">{item.name}</h2>
              <p>
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </div>
    </div>
  );
}
