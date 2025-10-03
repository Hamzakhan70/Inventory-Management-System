
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prisma/client.js";

dotenv.config();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Unauthorized" });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: "ADMIN", email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: "admin" });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Basic user login mapped to same admin flow for now to keep frontend connected
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try admin first
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign(
        { id: admin.id, role: "ADMIN", email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({ token, role: "admin" });
    }

    // If you have a user/customer table, plug it here. Placeholder behavior:
    return res.status(501).json({ message: "User login not implemented" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  try {
    // Placeholder endpoint to connect frontend; implement actual user creation with Prisma here
    return res.status(501).json({ message: "Signup not implemented" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    // Placeholder endpoint to connect frontend; implement email reset flow here
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required" });
    return res.json({ message: "If an account exists, a reset link will be sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Using JWT stateless auth; clients should discard token
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
