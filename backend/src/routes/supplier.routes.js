import { Router } from "express";
import * as supplierController from "../controllers/supplier.controller.js";

const router = Router();

router.post("/", supplierController.createSupplier);
router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplier);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);

export default router;
