import express from 'express';
import Delivery from '../models/Delivery.js';

const router = express.Router();

// Create new delivery
router.post('/', async (req, res) => {
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

// Get delivery status by ID
router.get('/:id/status', async (req, res) => {
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

// Update delivery status
router.patch('/:id/status', async (req, res) => {
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

export default router;
