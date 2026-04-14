import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Debug endpoint to check user data
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        const userData = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            hasCreatedAt: !!user.createdAt
        }));
        
        res.status(200).json({
            totalUsers: users.length,
            users: userData
        });
    } catch (error) {
        console.error("Debug Users Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Fix createdAt dates for existing users
router.post('/fix-dates', async (req, res) => {
    try {
        // Find users without createdAt
        const usersWithoutCreatedAt = await User.find({ createdAt: { $exists: false } });
        console.log('Users without createdAt:', usersWithoutCreatedAt.length);
        
        if (usersWithoutCreatedAt.length > 0) {
            // Set createdAt to current date for users without it
            const result = await User.updateMany(
                { createdAt: { $exists: false } },
                { $set: { createdAt: new Date() } }
            );
            console.log('Updated users:', result.modifiedCount);
        }
        
        // Check all users after update
        const allUsers = await User.find({});
        const userData = allUsers.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            hasCreatedAt: !!user.createdAt
        }));
        
        res.status(200).json({
            message: 'User dates fixed successfully',
            usersUpdated: usersWithoutCreatedAt.length,
            totalUsers: allUsers.length,
            users: userData
        });
    } catch (error) {
        console.error("Fix Dates Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
