import { Router } from "express";
import * as productController from "../../controllers/admin/product.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/", authenticate, isAdmin, productController.getAll);
router.post("/", authenticate, isAdmin, productController.create);
router.put("/:id", authenticate, isAdmin, productController.update);
router.delete("/:id", authenticate, isAdmin, productController.remove);

export default router;
