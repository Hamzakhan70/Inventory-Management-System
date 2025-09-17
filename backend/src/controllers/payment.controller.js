import {
  getPaymentsService,
  getPaymentByIdService,
  createPaymentService,
  updatePaymentStatusService,
  deletePaymentService,
} from "../services/payment.service.js";
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


// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await getPaymentsService();
    res.json({ success: true, data: payments });
  } catch (err) {
    console.error("Error in getPayments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await getPaymentByIdService(Number(req.params.id));
    if (!payment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error("Error in getPaymentById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a payment
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const payment = await createPaymentService({ orderId, amount, method });
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await updatePaymentStatusService(Number(req.params.id), req.body.status);
    res.json({ success: true, data: payment });
  } catch (err) {
    console.error("Error in updatePaymentStatus:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    await deletePaymentService(Number(req.params.id));
    res.json({ success: true, message: "Payment deleted" });
  } catch (err) {
    console.error("Error in deletePayment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
