import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
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
        let memberSince;
        if (user.createdAt) {
            memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        } else {
            // For existing users without createdAt, set a reasonable default
            memberSince = 'January 2024';
            // Also update the user to have createdAt for future requests
            await User.findByIdAndUpdate(user._id, { createdAt: new Date('2024-01-01') });
        }

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

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { userId, name, phone, dateOfBirth, gender, addresses } = req.body;
        
        console.log('Profile update request:', { userId, name, phone, dateOfBirth, gender, addresses });
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('User found:', user._id);
        console.log('Current addresses:', user.addresses);

        // Update all profile fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (gender) user.gender = gender;
        if (addresses) {
            console.log('Updating addresses to:', addresses);
            user.addresses = addresses;
        }

        await user.save();
        console.log('User saved successfully. New addresses:', user.addresses);

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

export default router;
