import * as customerService from "../services/customer.service.js";
import { successResponse } from "../utils/responce.js";
import AppError from "../utils/AppError.js";

export const createCustomer = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) throw new AppError("Name and Email are required", 400);

    const customer = await customerService.createCustomer(req.body);
    return successResponse(res, customer, "Customer created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllCustomers = async (req, res, next) => {
  try {
    const result = await customerService.getCustomers(req.query);
    return successResponse(res, result, "Customers fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) throw new AppError("Customer not found", 404);

    return successResponse(res, customer, "Customer fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const updated = await customerService.updateCustomer(req.params.id, req.body);
    return successResponse(res, updated, "Customer updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    return successResponse(res, null, "Customer deleted successfully");
  } catch (err) {
    next(err);
  }
};
