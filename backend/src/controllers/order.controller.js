// src/controllers/order.controller.js
import * as orderService from "../services/order.service.js";
import { successResponse } from "../utils/responce.js"; // keep your exact util path/name
import AppError from "../utils/AppError.js";

export const createOrder = async (req, res, next) => {
  try {
    const created = await orderService.createOrder(req.body);
    return successResponse(res, created, "Order created successfully", 201);
  } catch (err) {
    next(err);
  }
};


export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.query);
    return successResponse(res, orders, "Orders fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return successResponse(res, order, "Order fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(req.params.id, status);
    return successResponse(res, updatedOrder, "Order status updated successfully");
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
    console.log('cancel')
  try {
    const order = await orderService.cancelOrder(req.params.id);
    return successResponse(res, order, "Order cancelled successfully");
  } catch (err) {
    next(err);
  }
};