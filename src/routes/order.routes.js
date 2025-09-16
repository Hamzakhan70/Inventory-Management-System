// src/routes/order.routes.js
import express from "express";
import * as orderController from "../controllers/order.controller.js";

const router = express.Router();

import { isAdmin } from "../middlewares/admin.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

router.post("/", orderController.createOrder);

router.get("/", authenticate, isAdmin, orderController.getOrders);
router.get("/:id", authenticate, isAdmin, orderController.getOrderById);
router.patch("/:id/cancel", orderController.cancelOrder);
router.patch("/:id/status", authenticate, isAdmin, orderController.updateOrderStatus);


export default router;
