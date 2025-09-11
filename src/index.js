import express from 'express';
import productRoutes from './routes/product.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());


app.use('/products', productRoutes);
app.use("/suppliers", supplierRoutes);
app.use(errorHandler)

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
