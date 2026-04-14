import express from 'express';
import Delivery from '../models/Delivery.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get user order history
router.get('/', async (req, res) => {
    try {
        // This would typically get orders for a specific user
        // For now, returning all orders (should be filtered by userId in production)
        const deliveries = await Delivery.find({});
        res.status(200).json(deliveries);
    } catch (error) {
        console.error("Get Order History Error:", error);
        res.status(500).json({ message: "Server error fetching order history" });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const orderData = req.body;
        // This would create a new order
        res.status(201).json({ message: "Order created successfully", order: orderData });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(400).json({ message: "Error creating order", error: error.message });
    }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
    try {
        // This would get a specific order
        res.status(200).json({ message: "Order details", orderId: req.params.id });
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ message: "Server error fetching order" });
    }
});

// Cancel order
router.delete('/:id', async (req, res) => {
    try {
        // This would cancel a specific order
        res.status(200).json({ message: "Order cancelled successfully", orderId: req.params.id });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Server error cancelling order" });
    }
});

// Clear order history (delete specific deliveries and payments)
router.delete('/clear', async (req, res) => {
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

export default router;
