import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { stripeWebhook } from "../controllers/stripeWebHook.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
const router = express.Router();

router.post("/stripe", paymentController.initiateStripePayment);
router.get("/", authenticate, isAdmin, paymentController.getPayments); // admin only
router.get("/:id", authenticate, isAdmin, paymentController.getPaymentById); // admin only
router.get("/:id", authenticate, isAdmin, paymentController.updatePaymentStatus); // admin only
// Stripe webhook must use raw body parser
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
