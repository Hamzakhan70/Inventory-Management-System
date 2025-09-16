import * as paymentService from "../services/payment.service.js";
import { successResponse } from "../utils/responce.js";

export const initiateStripePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) throw new AppError("Order ID required", 400);

    const url = await paymentService.createStripeSession(orderId);
    return successResponse(res, { url }, "Stripe checkout initiated");
  } catch (err) {
    next(err);
  }
};
// Get all payments (Admin only)
export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get payment by ID (Admin only)
export const getPaymentById = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(req.params.id) },
      include: { order: true },
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }   
};
// Update payment status (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await prisma.payment.update({ 
      where: { id: Number(req.params.id) },
      data: { status } 
    });
    res.json(payment);
  }
  catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};