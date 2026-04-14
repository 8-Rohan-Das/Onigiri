import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
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

// Signup route
router.post('/signup', async (req, res) => {
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

// Forgot password route (dummy OTP)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // In a real app, you'd check if user exists and send an actual email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // Just returning success since we're using dummy OTP logic in frontend
        res.status(200).json({ message: "OTP sent successfully to your email!" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error during forgot password" });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update password (plain text as requested)
        user.password = password;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Server error during password reset" });
    }
});

export default router;
