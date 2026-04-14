import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products with optional filters
router.get('/', async (req, res) => {
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

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Products by Category Error:", error);
        res.status(500).json({ message: "Server error fetching products by category" });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Fetch Product Error:", error);
        res.status(500).json({ message: "Server error fetching product" });
    }
});

// Create new product
router.post('/', async (req, res) => {
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

export default router;
