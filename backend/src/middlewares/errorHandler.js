import { errorResponse } from "../utils/responce.js";


export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error caught:", err);

  // If it's our custom AppError
  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Prisma known errors
  if (err.code === "P2002") {
    return errorResponse(res, "Duplicate field value", 400, err.meta);
  }
  if (err.code === "P2003") {
    return errorResponse(res, "Invalid foreign key reference", 400, err.meta);
  }
  if (err.code === "P2025") {
    return errorResponse(res, "Record not found", 404, err.meta);
  }

  // Default fallback
  return errorResponse(res, "Internal Server Error", 500, err.message);
};
