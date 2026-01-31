import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HoveringCart.css';

const HoveringCart = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Default cart items if none saved
      const defaultItems = [
        { id: 1, name: 'Vegan Pizza Dough', quantity: 1, price: 120.00, icon: '🍕' },
        { id: 2, name: 'Pepperoni Pizza', quantity: 1, price: 180.00, icon: '🍕' },
        { id: 3, name: 'Fish Burger & Vege', quantity: 1, price: 150.00, icon: '🍔' },
      ];
      setCartItems(defaultItems);
      localStorage.setItem('cartItems', JSON.stringify(defaultItems));
    }
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40.00;
  const total = subtotal + deliveryFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      const updatedCart = cartItems.filter(item => item.id !== id);
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } else {
      const updatedCart = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Navigate to checkout
  const goToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  // Add item to cart (function to be called from other components)
  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  // Make addToCart available globally
  useEffect(() => {
    window.addToCart = addToCart;
  }, [cartItems]);

  return (
    <>
      {/* Cart Toggle Button */}
      <button 
        className="cart-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart"
      >
        {itemCount > 0 && (
          <span className="cart-badge">{itemCount}</span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button 
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button 
                className="continue-shopping-btn"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
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
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button 
                  className="checkout-btn"
                  onClick={goToCheckout}
                >
                  Proceed to Checkout
                </button>
                <button 
                  className="continue-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="cart-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default HoveringCart;
