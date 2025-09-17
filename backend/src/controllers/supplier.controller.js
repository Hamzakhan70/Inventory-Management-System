import * as supplierService from "../services/supplier.service.js";
import { successResponse } from "../utils/responce.js";
import AppError from "../utils/AppError.js";

export const createSupplier = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) throw new AppError("Name and Email are required", 400);

    const supplier = await supplierService.createSupplier(req.body);
    return successResponse(res, supplier, "Supplier created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    return successResponse(res, suppliers, "Suppliers fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    if (!supplier) throw new AppError("Supplier not found", 404);

    return successResponse(res, supplier, "Supplier fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const updated = await supplierService.updateSupplier(req.params.id, req.body);
    return successResponse(res, updated, "Supplier updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    await supplierService.deleteSupplier(req.params.id);
    return successResponse(res, null, "Supplier deleted successfully");
  } catch (err) {
    next(err);
  }
};
