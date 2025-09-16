import * as refundService from "../services/refund.service.js";
import { successResponse } from "../utils/responce.js";

export const createRefund = async (req, res, next) => {
  try {
    const { paymentId, reason } = req.body;
    const refund = await refundService.refundPayment(paymentId, reason);
    return successResponse(res, refund, "Refund processed successfully");
  } catch (err) {
    next(err);
  }
};

export const getAllRefunds = async (req, res, next) => {
  try {
    const refunds = await refundService.getRefunds();
    return successResponse(res, refunds, "Refunds fetched successfully");
  } catch (err) {
    next(err);
  }
};
