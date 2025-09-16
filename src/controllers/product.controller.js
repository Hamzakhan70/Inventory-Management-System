import * as productService from "../services/product.service.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/responce.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, supplierId } = req.body;
    if (!supplierId) throw new AppError("Supplier ID is required", 400);

    const product = await productService.createProduct(req.body);
    return successResponse(res, product, "Product created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    return successResponse(res, products, "Products fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);

    return successResponse(res, product, "Product fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    return successResponse(res, updated, "Product updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return successResponse(res, null, "Product deleted successfully");
  } catch (err) {
    next(err);
  }
};
