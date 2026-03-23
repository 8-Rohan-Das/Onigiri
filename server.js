import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Mock database (replace with real database later)
let users = [
  {
    id: 'user123',
    email: 'user@onigiri.com',
    password: 'password', // In production, this should be hashed
    name: 'John Doe',
    createdAt: new Date().toISOString()
  }
];

let orders = [];
let products = [
  { id: 1, name: 'Salmon Onigiri', price: 8.99, category: 'seafood', description: 'Fresh salmon with rice' },
  { id: 2, name: 'Tuna Onigiri', price: 7.99, category: 'seafood', description: 'Tuna filled rice ball' },
  { id: 3, name: 'Vegetable Onigiri', price: 6.99, category: 'vegetarian', description: 'Mixed vegetables' }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Onigiri API Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: 'user' + Date.now(),
    email,
    password, // In production, hash this password
    name: name || email.split('@')[0],
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
    token
  });
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // In production, send email with reset link
  res.json({ message: 'Password reset email sent' });
});

// Product routes
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => p.category === category);
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Order routes
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total, shippingAddress } = req.body;
  
  const newOrder = {
    id: 'order' + Date.now(),
    userId: req.user.id,
    items,
    total,
    shippingAddress,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/api/user/orders', authenticateToken, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ id: user.id, email: user.email, name: user.name });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
