import express from 'express';
import productRoutes from './routes/product.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import customerRoutes from './routes/customer.routes.js';
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import bodyParser from 'body-parser';
import refundRoutes from './routes/refund.routes.js';
import authRoutes from "./routes/auth.routes.js";
import productAdminRoutes from "./routes/admin/product.routes.js";
// import orderAdminRoutes from "./routes/admin/order.routes.js";
// import paymentAdminRoutes from "./routes/admin/payment.routes.js";
const app = express();

// 👇 Custom raw body saver only for webhook
app.use(
  "/payments/stripe/webhook",
  bodyParser.raw({ type: "application/json" })
);

// 👇 Normal JSON for everything else
app.use(express.json());
// Auth
app.use("/api/auth", authRoutes);
// Routes
app.use("/payments", paymentRoutes);
app.use('/products', productRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);
app.use("/refunds", refundRoutes);
// Admin
app.use("/api/admin/products", productAdminRoutes);
// app.use("/api/admin/orders", orderAdminRoutes);
// app.use("/api/admin/payments", paymentAdminRoutes);
app.use(errorHandler)

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
