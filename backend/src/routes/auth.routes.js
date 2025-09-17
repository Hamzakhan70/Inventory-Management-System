import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/admin/login
router.post("/admin/login", adminLogin);

export default router;
