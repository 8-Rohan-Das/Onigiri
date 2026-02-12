import React from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import './CheckoutPage.css';
import logo from '../../assets/logo.png';
import userImage from '../../assets/user.png';

const inr = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

const CheckoutPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    showSummary,
    toggleSummary,
    formData,
    handleInputChange,
    subtotal,
    deliveryFee,
    tax,
    total,
    handleSubmit,
    handleBackToHome,
    handleLogout,
    userName
  } = useCheckout();

  return (
    <div className="checkout-container">
      <header className="checkout-header" role="banner">
        <div className="header-left">
          <button aria-label="Back to home" className="back-btn" onClick={handleBackToHome} type="button">
            <span>←</span>
            <span className="btn-text">Back to Home</span>
          </button>

          <div className="logo-section" aria-hidden>
            <img src={logo} alt="Onigiri Logo" className="logo-image" />
            <h1>ONIGIRI</h1>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info" aria-label={`Signed in as ${userName}`}>
            <img src={userImage} alt="" className="user-avatar" />
            <span className="user-name">{userName}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #dc3545',
              color: '#dc3545',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="checkout-content">
        <main className="checkout-main" aria-labelledby="checkout-title">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 id="checkout-title" className="visually-hidden">Checkout form</h2>

            <section className="form-section" aria-labelledby="delivery-heading">
              <h2 id="delivery-heading">Delivery Information</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </div>
            </section>

            <section className="form-section" aria-labelledby="payment-heading">
              <h2 id="payment-heading">Payment Method</h2>

              <div className="payment-options" role="radiogroup" aria-label="Payment method">
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                  <span>Cash on Delivery</span>
                </label>

                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} />
                  <span>Credit / Debit Card</span>
                </label>

                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} />
                  <span>UPI Payment</span>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder="John Doe" required />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input id="cvv" name="cvv" inputMode="numeric" value={formData.cvv} onChange={handleInputChange} placeholder="123" required />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="upi-details">
                  <div className="form-group">
                    <label htmlFor="upiId">UPI ID</label>
                    <input id="upiId" name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="username@upi" required />
                  </div>
                </div>
              )}
            </section>

            <div className="form-actions">
              <button type="submit" className="place-order-btn" disabled={cartItems.length === 0}>
                Place Order • {inr(total)}
              </button>
            </div>
          </form>
        </main>

        {/* Desktop sidebar or mobile toggle */}
        <aside className={`order-summary ${showSummary ? 'open' : ''}`} aria-labelledby="summary-heading">
          <div className="summary-top">
            <h2 id="summary-heading">Order Summary</h2>

            {/* Mobile toggle button */}
            <button
              className="summary-toggle"
              type="button"
              aria-expanded={showSummary}
              onClick={toggleSummary}
            >
              {showSummary ? 'Hide' : 'View'}
            </button>
          </div>

          <div className="order-items" role="list">
            {cartItems.length === 0 && (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <button type="button" className="cta" onClick={handleBackToHome}>Browse Menu</button>
              </div>
            )}

            {cartItems.map((item) => (
              <div key={item.id} className="order-item" role="listitem">
                <div className="item-info">
                  <span className="item-icon" aria-hidden>{item.icon}</span>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <span className="item-price">{inr(item.price)}</span>
                  </div>
                </div>

                <div className="item-controls">
                  <div className="quantity-controls" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))}
                      className="quantity-btn"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span className="quantity" aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 0) + 1)}
                      className="quantity-btn"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>

                  <button type="button" onClick={() => removeFromCart(item.id)} className="remove-btn" aria-label={`Remove ${item.name}`}>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span>{inr(deliveryFee)}</span>
            </div>
            <div className="price-row">
              <span>Tax (5%)</span>
              <span>{inr(tax)}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>{inr(total)}</span>
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
