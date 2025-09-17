import Stripe from "stripe";
import prisma from "../prisma/client.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const refundPayment = async (paymentId, reason) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment || payment.status !== "SUCCESS") {
    throw new Error("Refund not allowed: Payment not found or not successful");
  }

  if (!payment.stripePaymentIntentId) {
    throw new Error("No Stripe PaymentIntent found for this payment.");
  }

  
const refund = await stripe.refunds.create({
  payment_intent: payment.stripePaymentIntentId, // ✅ now works
  amount: Math.round(payment.amount * 100),
  reason: reason || undefined,
});

  return await prisma.refund.create({
    data: {
      paymentId,
      amount: payment.amount,
      reason,
      status: refund.status.toUpperCase(),
    },
  });
};


export const getRefunds = async () => {
  return prisma.refund.findMany({ include: { payment: true } });
};
