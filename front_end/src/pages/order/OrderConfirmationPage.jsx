import React, { useState, useEffect } from 'react';
import { getStoredUser, getUserStoredItem } from '../../utils/storageUtils';

import { useNavigate, useLocation } from 'react-router-dom';

import './OrderConfirmationPage.css';

import logo from '../../assets/logo.png';

import userImage from '../../assets/user.png';



const OrderConfirmationPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [countdown, setCountdown] = useState(30);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Get user data from localStorage
  const userData = getStoredUser();
  const userName = userData.name || 'Guest';
  
  // Initialize orderData lazily
  const [orderData] = useState(() => {
     if (location.state?.orderData) {
        return location.state.orderData;
     }

     return getUserStoredItem('lastOrder');
  });

  // Ensure we have a stable ID for the order
  const [displayOrderId] = useState(() => {
    // Check if orderData exists before accessing its properties
    return orderData?.orderNumber || 'ORD' + Date.now();
  });



  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData) {
      navigate('/home');
      return;
    }

    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/order-history');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);



  const handleTrackOrder = () => {
    setShowTrackingModal(true);
  };



  const handleViewOrders = () => {

    navigate('/order-history');

  };



  const handleBackToHome = () => {

    navigate('/home');

  };







  if (!orderData) {

    return (

      <div className="confirmation-container">

        <div className="loading-spinner">Loading order details...</div>

      </div>

    );

  }



  return (

    <div className="confirmation-container">

      {/* Header */}

      <header className="confirmation-header">

        <div className="header-left">

          <button className="back-btn" onClick={handleBackToHome}>

            ← Back to Home

          </button>

        </div>

        <div className="header-center">

          <img src={logo} alt="Onigiri Logo" className="logo-image" />

          <h1>ONIGIRI</h1>

        </div>

        <div className="header-right">

          <div className="user-info">

            <img src={userImage} alt="User" className="user-avatar" />

            <span>{userName}</span>

          </div>

        </div>

      </header>



      {/* Main Content */}

      <main className="confirmation-main">

        <div className="confirmation-content">

          {/* Success Message */}

          <section className="success-section">

            <div className="success-icon">✅</div>

            <h1>Order Confirmed!</h1>

            <p className="success-message">

              Thank you for your order! Your delicious food is being prepared.

            </p>

            <div className="order-number">

              Order #{displayOrderId}

            </div>

          </section>



          {/* Order Details */}

          <section className="order-details-section">

            <h2>Order Details</h2>

            

            <div className="order-info-grid">

              <div className="info-card">

                <h3>Delivery Address</h3>

                <p>{orderData.deliveryInfo?.address || 'No address provided'}</p>
                <p>{orderData.deliveryInfo?.city || ''}{orderData.deliveryInfo?.state ? ', ' + orderData.deliveryInfo.state : ''}{orderData.deliveryInfo?.zipCode ? ' ' + orderData.deliveryInfo.zipCode : ''}</p>

              </div>

              

              <div className="info-card">

                <h3>Estimated Delivery</h3>

                <p className="delivery-time">25-35 minutes</p>

                <p className="delivery-status">Preparing your order</p>

              </div>

              

              <div className="info-card">

                <h3>Payment Method</h3>

                <p>{orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 

                    orderData.paymentMethod === 'card' ? 'Card Payment' : 'UPI Payment'}</p>

                <p>Total: ₹{orderData.total?.toFixed(2) || '0.00'}</p>

              </div>

            </div>

          </section>



          {/* Order Items */}

          <section className="order-items-section">

            <h2>Order Items</h2>

            <div className="order-items-list">

              {orderData.items?.map((item, index) => (

                <div key={index} className="order-item">

                  <div className="item-info">

                    <span className="item-icon">{item.icon || '🍽️'}</span>

                    <div className="item-details">

                      <h4>{item.name}</h4>

                      <span className="item-quantity">Quantity: {item.quantity}</span>

                    </div>

                  </div>

                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>

                </div>

              ))}

            </div>

            

            <div className="price-summary">

              <div className="price-row">

                <span>Subtotal</span>

                <span>₹{orderData.subtotal?.toFixed(2) || '0.00'}</span>

              </div>

              <div className="price-row">

                <span>Delivery Fee</span>

                <span>₹{orderData.deliveryFee?.toFixed(2) || '0.00'}</span>

              </div>

              <div className="price-row">

                <span>Tax</span>

                <span>₹{orderData.tax?.toFixed(2) || '0.00'}</span>

              </div>

              <div className="price-row total">

                <span>Total Paid</span>

                <span>₹{orderData.total?.toFixed(2) || '0.00'}</span>

              </div>

            </div>

          </section>



          {/* Action Buttons */}

          <section className="actions-section">

            <button className="action-btn primary" onClick={handleTrackOrder}>

              📍 Track Order

            </button>

            <button className="action-btn secondary" onClick={handleViewOrders}>

              📋 View All Orders

            </button>

            <button className="action-btn tertiary" onClick={handleBackToHome}>

              🏠 Order More Food

            </button>

          </section>



          {/* Auto-redirect Notice */}

          <div className="redirect-notice">

            <p>Redirecting to order history in <span className="countdown">{countdown}</span> seconds...</p>

          </div>

        </div>

      </main>

      {/* Order Tracking Coming Soon Modal */}
      {showTrackingModal && (
        <div className="tracking-modal-overlay" onClick={() => setShowTrackingModal(false)}>
          <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="tracking-modal-close" onClick={() => setShowTrackingModal(false)}>✕</button>
            <div className="tracking-modal-icon">🚀</div>
            <h2 className="tracking-modal-title">Feature Coming Soon!</h2>
            <p className="tracking-modal-subtitle">
              Real-time order tracking for <strong>#{displayOrderId}</strong> is on its way!
            </p>
            <div className="tracking-steps">
              <div className="tracking-step done">✅ Order Placed</div>
              <div className="tracking-step done">✅ Confirmed</div>
              <div className="tracking-step upcoming">🍳 Preparing</div>
              <div className="tracking-step upcoming">🚴 On the Way</div>
              <div className="tracking-step upcoming">🏠 Delivered</div>
            </div>
            <p className="tracking-modal-note">
              We're building live tracking so you can follow your food every step of the way. Stay tuned!
            </p>
            <button className="tracking-modal-btn" onClick={() => setShowTrackingModal(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>

  );

};



export default OrderConfirmationPage;


