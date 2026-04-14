import express from 'express';
import Payment from '../models/Payment.js';
import Delivery from '../models/Delivery.js';
import User from '../models/User.js';

const router = express.Router();

// Process payment
router.post('/', async (req, res) => {
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
router.get('/:id/status', async (req, res) => {
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

export default router;
