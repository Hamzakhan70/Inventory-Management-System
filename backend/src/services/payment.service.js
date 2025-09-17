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



// Get all payments
export const getPaymentsService = async () => {
  return await prisma.payment.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });
};

// Get single payment by ID
export const getPaymentByIdService = async (id) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: { order: true },
  });
};

// Create a payment
export const createPaymentService = async (data) => {
  return await prisma.payment.create({
    data: {
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
      status: "PENDING",
    },
  });
};

// Update payment status
export const updatePaymentStatusService = async (id, status) => {
  return await prisma.payment.update({
    where: { id },
    data: { status },
  });
};

// Delete payment
export const deletePaymentService = async (id) => {
  return await prisma.payment.delete({
    where: { id },
  });
};
