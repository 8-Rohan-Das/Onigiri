import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './HoveringCart.css';

const HoveringCart = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart: removeItem, // Rename to match local usage or update usage
    getCartTotal,
    getCartCount
  } = useCart();

  const total = getCartTotal();
  const subtotal = total - 40; // Approx back-calculation or just use total
  const deliveryFee = 40.00;
  const itemCount = getCartCount();

  const goToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

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
