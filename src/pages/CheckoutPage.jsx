import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';
import logo from '../assets/logo.png';
import userImage from '../assets/user.png';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userName = userData.name || 'Guest';
  
  // Cart items from localStorage or default
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [
      { id: 1, name: 'Vegan Pizza Dough', quantity: 1, price: 120.00, icon: '🍕' },
      { id: 2, name: 'Pepperoni Pizza', quantity: 1, price: 180.00, icon: '🍕' },
      { id: 3, name: 'Fish Burger & Vege', quantity: 1, price: 150.00, icon: '🍔' },
    ];
  });

  // Form state
  const [formData, setFormData] = useState({
    fullName: userName,
    email: userData.email || '',
    phone: '',
    address: 'Plot No. 42, Sector 5, CDA Building',
    city: 'Bhubaneswar',
    state: 'Odisha',
    zipCode: '751019',
    paymentMethod: 'cod',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40.00;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save cart items to localStorage for order history
    localStorage.setItem('lastOrder', JSON.stringify({
      items: cartItems,
      total: total,
      date: new Date().toISOString(),
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
    }));
    
    // Clear cart
    localStorage.removeItem('cartItems');
    setCartItems([]);
    
    alert('Order placed successfully! Thank you for your order.');
    navigate('/order-history');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="checkout-container">
      {/* Header */}
      <header className="checkout-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <div className="logo-section">
            <img src={logo} alt="Onigiri Logo" className="logo-image" />
            <h1>ONIGIRI</h1>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <img src={userImage} alt="User" className="user-avatar" />
            <span>{userName}</span>
          </div>
        </div>
      </header>

      <div className="checkout-content">
        {/* Main Content */}
        <main className="checkout-main">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Delivery Information */}
            <section className="form-section">
              <h2>Delivery Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                  />
                  <span>UPI Payment</span>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                    <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="upi-details">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      placeholder="username@upi"
                      required
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Place Order Button */}
            <button type="submit" className="place-order-btn">
              Place Order • ₹{total.toFixed(2)}
            </button>
          </form>
        </main>

        {/* Order Summary Sidebar */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-icon">{item.icon}</span>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <span className="item-price">₹{item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="estimated-delivery">
            <h3>Estimated Delivery</h3>
            <p>25-35 minutes</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
