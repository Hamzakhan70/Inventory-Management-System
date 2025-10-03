import { Router } from "express";
import { adminLogin, login, signup, forgotPassword, logout } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/admin/login
router.post("/admin/login", adminLogin);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
