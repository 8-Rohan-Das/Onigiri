import React from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import ThemeToggle from '../../components/ThemeToggle';
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

          <div 
            className="logo-section" 
            onClick={handleBackToHome}
            style={{ cursor: 'pointer' }}
          >
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
          <div style={{ marginLeft: '15px' }}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="checkout-content">
        <div className="checkout-main-grid">
          <header className="checkout-flow-header">
            <div className="checkout-progress">
              <div className="progress-step completed">
                <span className="step-icon">🛒</span>
                <span className="step-label">Cart</span>
              </div>
              <div className="progress-line completed"></div>
              <div className="progress-step active">
                <span className="step-icon">📋</span>
                <span className="step-label">Details</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <span className="step-icon">🚀</span>
                <span className="step-label">Finish</span>
              </div>
            </div>
          </header>

          <main className="checkout-main" aria-labelledby="checkout-title">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2 id="checkout-title" className="visually-hidden">Checkout form</h2>

              <section className="form-section" aria-labelledby="delivery-heading">
                <header className="section-header">
                  <div className="section-title-wrapper">
                  </div>
                </header>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="John Doe" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" maxLength="10" pattern="\d{10}" title="Please enter a valid 10-digit Indian phone number" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <input id="address" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Flat, Street, Landmark" />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="e.g. Bhubaneswar" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input id="state" name="state" value={formData.state} onChange={handleInputChange} required placeholder="e.g. Odisha" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required placeholder="123456" />
                  </div>
                </div>
              </section>

              <section className="form-section" aria-labelledby="payment-heading">
                <header className="section-header">
                  <div className="section-title-wrapper">
                    <span className="section-icon">💳</span>
                    <h2 id="payment-heading">Payment Method</h2>
                  </div>
                  <p className="section-desc">Select your preferred way to pay securely</p>
                </header>

                <div className="payment-options" role="radiogroup" aria-label="Payment method">
                  <label className={`payment-option-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden-radio" />
                    <div className="payment-option-content">
                      <span className="pay-icon">💵</span>
                      <div className="pay-text">
                        <span className="pay-title">Cash on Delivery</span>
                        <span className="pay-meta">Pay when you receive</span>
                      </div>
                      <div className="check-mark">✓</div>
                    </div>
                  </label>

                  <label className={`payment-option-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden-radio" />
                    <div className="payment-option-content">
                      <span className="pay-icon">💳</span>
                      <div className="pay-text">
                        <span className="pay-title">Credit / Debit Card</span>
                        <span className="pay-meta">All major cards accepted</span>
                      </div>
                      <div className="check-mark">✓</div>
                    </div>
                  </label>

                  <label className={`payment-option-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="hidden-radio" />
                    <div className="payment-option-content">
                      <span className="pay-icon">📱</span>
                      <div className="pay-text">
                        <span className="pay-title">UPI Payment</span>
                        <span className="pay-meta">GPay, PhonePe, etc.</span>
                      </div>
                      <div className="check-mark">✓</div>
                    </div>
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
      </div>

      {/* Desktop sidebar or mobile toggle */}
        <aside className="order-summary" aria-labelledby="summary-heading">
          <div className="summary-top">
            <h2 id="summary-heading">Order Summary</h2>
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
