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
import Product from "./models/Product.js";
import Delivery from "./models/Delivery.js";
import Payment from "./models/Payment.js";
const app = express();

// Middleware
app.use(cors());
app.use(json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.error("MongoDB Connection Error:", err));

// Routes
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password (in production, use bcrypt for password comparison)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ 
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Create new user
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ 
            message: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) {
            filters.category = req.query.category;
        }

        if (req.query.popular === 'true') {
            filters.isPopular = true;
        }

        const products = await Product.find(filters);
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        res.status(500).json({ message: "Server error fetching products" });
    }
});

app.get('/api/products/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products by Category Error:", error);
        res.status(500).json({ message: "Server error fetching products by category" });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        // Here we could add some basic validation, but the mongoose schema handles most of it.
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// Delivery Routes
app.post('/api/deliveries', async (req, res) => {
    try {
        const { user, items, deliveryAddress, totalAmount } = req.body;
        const delivery = new Delivery({ user, items, deliveryAddress, totalAmount, status: 'Pending' });
        const savedDelivery = await delivery.save();
        res.status(201).json(savedDelivery);
    } catch (error) {
        console.error("Create Delivery Error:", error);
        res.status(400).json({ message: "Error creating delivery", error: error.message });
    }
});

app.get('/api/deliveries/:id/status', async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id).select('status');
        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }
        res.status(200).json({ status: delivery.status });
    } catch (error) {
        console.error("Fetch Delivery Status Error:", error);
        res.status(500).json({ message: "Server error fetching delivery status", error: error.message });
    }
});

app.patch('/api/deliveries/:id/status', async (req, res) => {
    try {
        const allowedStatuses = ['Pending', 'Delivered', 'Cancelled'];
        const { status } = req.body;

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        const delivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!delivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        res.status(200).json({ status: delivery.status, _id: delivery._id });
    } catch (error) {
        console.error("Update Delivery Status Error:", error);
        res.status(500).json({ message: "Server error updating delivery status", error: error.message });
    }
});

// Payment Routes
app.post('/api/payments', async (req, res) => {
    try {
        const { delivery, user, method, amount, transactionId } = req.body;
        
        // Simulating payment processing
        const paymentStatus = 'Completed'; 
        
        const payment = new Payment({
            delivery,
            user,
            method,
            amount,
            status: paymentStatus,
            transactionId: method !== 'Cash on Delivery' ? transactionId || `txn_${Date.now()}` : undefined
        });
        
        const savedPayment = await payment.save();
        
        // Sync Delivery status based on payment outcome
        const deliveryStatus = paymentStatus === 'Completed' ? 'Delivered'
                             : (paymentStatus === 'Failed' || paymentStatus === 'Refunded') ? 'Cancelled'
                             : 'Pending';
        await Delivery.findByIdAndUpdate(delivery, { status: deliveryStatus });
        
        // Update user statistics when payment is completed
        if (paymentStatus === 'Completed') {
            await User.findByIdAndUpdate(user, {
                $inc: {
                    totalOrders: 1,
                    totalSpent: amount
                }
            });
        }
        
        res.status(201).json(savedPayment);
    } catch (error) {
        console.error("Process Payment Error:", error);
        res.status(400).json({ message: "Error processing payment", error: error.message });
    }
});

// Get payment status by payment ID
app.get('/api/payments/:id/status', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).select('status');
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ status: payment.status });
    } catch (error) {
        console.error("Fetch Payment Status Error:", error);
        res.status(500).json({ message: "Server error fetching payment status", error: error.message });
    }
});

// User Profile Routes
app.get('/api/user/profile', async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate member since date
        const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }) : 'Unknown';

        res.status(200).json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            addresses: user.addresses,
            totalOrders: user.totalOrders,
            totalSpent: user.totalSpent,
            memberSince: memberSince,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server error fetching profile", error: error.message });
    }
});

app.put('/api/user/profile', async (req, res) => {
    try {
        const { userId, name, phone, dateOfBirth, gender, addresses } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update all profile fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (addresses) user.addresses = addresses;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                addresses: user.addresses
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error updating profile", error: error.message });
    }
});

// Delete specific deliveries and payments (used by Clear History on the frontend)
app.delete('/api/orders/clear', async (req, res) => {
    try {
        const { deliveryIds = [], paymentIds = [] } = req.body;

        console.log('Clear history request:', { deliveryIds, paymentIds });

        // Validate input
        if (!Array.isArray(deliveryIds) || !Array.isArray(paymentIds)) {
            return res.status(400).json({ 
                message: 'Invalid input: deliveryIds and paymentIds must be arrays' 
            });
        }

        const [deliveryResult, paymentResult] = await Promise.all([
            deliveryIds.length > 0
                ? Delivery.deleteMany({ _id: { $in: deliveryIds } })
                : Promise.resolve({ deletedCount: 0 }),
            paymentIds.length > 0
                ? Payment.deleteMany({ _id: { $in: paymentIds } })
                : Promise.resolve({ deletedCount: 0 })
        ]);

        console.log('Clear history results:', {
            deliveriesDeleted: deliveryResult.deletedCount,
            paymentsDeleted: paymentResult.deletedCount
        });

        res.status(200).json({
            message: 'History cleared from database',
            deliveriesDeleted: deliveryResult.deletedCount,
            paymentsDeleted: paymentResult.deletedCount,
            totalDeleted: deliveryResult.deletedCount + paymentResult.deletedCount
        });
    } catch (error) {
        console.error("Clear History Error:", error);
        res.status(500).json({ 
            message: "Server error clearing history", 
            error: error.message 
        });
    }
});

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
