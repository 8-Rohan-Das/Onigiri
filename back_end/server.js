import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";

// Import route files
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import deliveryRoutes from './routes/delivery.js';
import paymentRoutes from './routes/payment.js';
import debugRoutes from './routes/debug.js';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log("MongoDB Connected");
    
    // Fix users without createdAt dates
    try {
        const usersWithoutCreatedAt = await User.find({ createdAt: { $exists: false } });
        if (usersWithoutCreatedAt.length > 0) {
            const result = await User.updateMany(
                { createdAt: { $exists: false } },
                { $set: { createdAt: new Date() } }
            );
            console.log(`Fixed createdAt for ${result.modifiedCount} users`);
        }
    } catch (error) {
        console.error("Error fixing user dates:", error);
    }
})
.catch(err=>console.error("MongoDB Connection Error:", err));

// Route middleware
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/debug', debugRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
