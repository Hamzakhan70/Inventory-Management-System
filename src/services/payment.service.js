import Stripe from "stripe";
import prisma from '../prisma/client.js';
import AppError from "../utils/AppError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { items: { include: { product: true } } },
  });

  if (!order) throw new AppError("Order not found", 404);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
    metadata: { orderId: order.id.toString() }, // ✅ correct place
  });

  // Save payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.total,
      status: "PENDING",
      method: "STRIPE",
 stripePaymentIntentId: null,   // leave null for now
    stripeSessionId: session.id,   // save session id
    },
  });

  return session.url;
};