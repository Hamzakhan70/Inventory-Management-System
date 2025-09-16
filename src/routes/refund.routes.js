import express from "express";
import * as refundController from "../controllers/refund.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
const router = express.Router();

// Only admin should access (middleware will be added later)
router.post("/", refundController.createRefund);
router.get("/", authenticate, isAdmin, refundController.getAllRefunds);

export default router;
