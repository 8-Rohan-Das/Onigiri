import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getUserStoredItem, setUserStoredItem, removeUserStoredItem } from '../../utils/storageUtils.js';
import { paymentAPI, orderAPI } from '../../services/api.js';

import NotificationButton from '../../components/NotificationButton';
import HoveringCart from '../../components/HoveringCart';
import '../home/homepage.css';
import './OrderHistoryPage.css'; // Import dedicated CSS
import logo from '../../assets/logo.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';

import userImage from '../../assets/user.png';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('order-history');
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  
  // Get user data from localStorage
  const userData = getStoredUser();
  const userName = userData.name || 'Guest';

  // Navigation items
  const navItems = [
    { id: 'food-order', label: 'Food Order', image: restaurantImage },
    { id: 'favorite', label: 'Favorite', image: heartImage },
    { id: 'messages', label: 'Messages', image: emailImage },
    { id: 'order-history', label: 'Order History', image: orderHistoryImage },
    { id: 'others', label: 'User Details', image: otherImage },
  ];

  // Order history data
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders once from localStorage on mount
    try {
      const savedHistory = getUserStoredItem('orderHistory', []);
      const lastOrder    = getUserStoredItem('lastOrder');

      let allOrders = Array.isArray(savedHistory) ? savedHistory : [];

      if (lastOrder && !allOrders.find(o => o.orderNumber === lastOrder.orderNumber)) {
        allOrders = [lastOrder, ...allOrders];
        setUserStoredItem('orderHistory', allOrders);
        removeUserStoredItem('lastOrder');
      }

      const formatted = allOrders.map(order => ({
        id:          '#' + (order.orderNumber || Date.now()).toString().slice(-6),
        fullId:      order.orderNumber,
        deliveryId:  order.deliveryId  || null,
        paymentId:   order.paymentId   || null,
        date:        order.timestamp ? new Date(order.timestamp).toLocaleDateString()  : new Date().toLocaleDateString(),
        time:        order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status:      order.status || 'Pending',
        items:       Array.isArray(order.items) ? order.items : [],
        subtotal:    order.subtotal    || 0,
        deliveryFee: order.deliveryFee || 0,
        total:       order.total       || 0,
        restaurant:  order.restaurant  || 'Onigiri'
      }));

      setOrders(formatted);
    } catch (err) {
      console.error('OrderHistoryPage: Error loading orders:', err);
    }
  }, []);

  // Poll the backend every 15 s to reflect Payment.status changes made in MongoDB
  useEffect(() => {
    // Map payment status → display status (3 values only)
    const mapPaymentStatus = (paymentStatus) => {
      switch ((paymentStatus || '').toLowerCase()) {
        case 'completed':  return 'Delivered';
        case 'failed':
        case 'refunded':   return 'Cancelled';
        default:           return 'Pending';
      }
    };

    const syncStatuses = async () => {
      // Only poll orders that were saved to the DB (have a paymentId)
      const dbOrders = orders.filter(o => o.paymentId);
      if (dbOrders.length === 0) return;

      const updates = await Promise.allSettled(
        dbOrders.map(o =>
          paymentAPI.getStatus(o.paymentId)
            .then(res => ({ fullId: o.fullId, status: mapPaymentStatus(res.data.status) }))
        )
      );

      const statusMap = {};
      updates.forEach(result => {
        if (result.status === 'fulfilled') {
          statusMap[result.value.fullId] = result.value.status;
        }
      });

      if (Object.keys(statusMap).length === 0) return;

      // Update UI state
      setOrders(prev => prev.map(o => statusMap[o.fullId] ? { ...o, status: statusMap[o.fullId] } : o));

      // Keep localStorage in sync so refresh shows correct status
      const history = getUserStoredItem('orderHistory', []);
      const updated = history.map(o => statusMap[o.orderNumber] ? { ...o, status: statusMap[o.orderNumber] } : o);
      setUserStoredItem('orderHistory', updated);
    };

    if (orders.length === 0) return;
    syncStatuses();                              // run immediately
    const interval = setInterval(syncStatuses, 15000); // then every 15 s
    return () => clearInterval(interval);
  }, [orders.length]);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => (o.status || '').toLowerCase() === filterStatus);

  const handleReorder    = (order) => alert(`Reordering items from ${order.id}`);
  const handleViewDetails= (order) => alert(`Viewing details for order ${order.id}`);
  const handleTrackOrder = (order) => { setTrackedOrder(order); setShowTrackingModal(true); };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all order history? This will permanently delete your orders from the database.')) return;

    // Collect IDs of DB-backed orders
    const deliveryIds = orders.map(o => o.deliveryId).filter(Boolean);
    const paymentIds  = orders.map(o => o.paymentId).filter(Boolean);

    // Show clearing feedback
    const clearButton = document.querySelector('button[onClick*="handleClearHistory"]');
    if (clearButton) {
      clearButton.textContent = 'Clearing...';
      clearButton.disabled = true;
    }

    // Delete from DB (best-effort - clear localStorage regardless)
    try {
      if (deliveryIds.length > 0 || paymentIds.length > 0) {
        const response = await orderAPI.clearHistory(deliveryIds, paymentIds);
        console.log('Clear history response:', response.data);
        
        // Show success feedback
        if (response.data.deliveriesDeleted > 0 || response.data.paymentsDeleted > 0) {
          console.log(`Successfully deleted ${response.data.deliveriesDeleted} deliveries and ${response.data.paymentsDeleted} payments from database`);
        }
      }
    } catch (err) {
      console.error('Failed to delete orders from DB:', err);
      // Show error feedback but continue with localStorage cleanup
      alert('Warning: Could not clear data from server, but local history will be cleared.');
    } finally {
      // Always clear localStorage and UI
      removeUserStoredItem('orderHistory');
      removeUserStoredItem('lastOrder');
      setOrders([]);
      
      // Reset button
      if (clearButton) {
        clearButton.textContent = 'History Cleared';
        setTimeout(() => {
          clearButton.textContent = 'Clear History';
          clearButton.disabled = false;
        }, 2000);
      }
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':  return '#00c851';
      case 'cancelled':  return '#ff4444';
      case 'pending':    return '#ffaa00';
      default:           return '#666';
    }
  };

  return (
    <div className="homepage-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div 
          className="sidebar-logo" 
          onClick={() => navigate('/home')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="Onigiri Logo" className="logo-image" />
          <h1>ONIGIRI</h1>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.id);
                if (item.id === 'food-order') {
                  navigate('/home');
                } else if (item.id === 'favorite') {
                  navigate('/favorite');
                } else if (item.id === 'messages') {
                  navigate('/messages');
                } else if (item.id === 'order-history') {
                  navigate('/order-history');
                } else if (item.id === 'others') {
                  navigate('/others');
                }
              }}
            >
              <span className="nav-icon">
                {item.image ? (
                  <img src={item.image} alt={item.label} style={{width: '30px', height: '30px', objectFit: 'cover'}} />
                ) : (
                  item.icon
                )}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="user-profile">
            <div className="profile-image">
              <img src={userImage} alt="User Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
            </div>
            <div className="user-info">
              <h3>Order History, {userName}!</h3>
              <p>View and track your past orders</p>
            </div>
          </div>
          <NotificationButton onClick={() => navigate('/notifications')} />
        </header>

        {/* Filter Section */}
        <section className="filter-shelf">
          <div className="filter-shelf-top">
            <h2 className="section-title">Order Dashboard</h2>
            <button 
              className="clear-history-premium"
              onClick={handleClearHistory}
            >
              <span className="clear-icon">🗑️</span>
              <span className="clear-text">Clear History</span>
            </button>
          </div>
          <div className="filter-pills-container">
            <div className="filter-pills" role="tablist">
              {['all', 'pending', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                  role="tab"
                  aria-selected={filterStatus === status}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Orders Grid */}
        <section className="orders-dashboard-grid">
          {filteredOrders.length > 0 ? (
            <div className="orders-masonry">
              {filteredOrders.map((order, idx) => (
                <div 
                  key={order.id} 
                  className="order-card-premium"
                  style={{ '--order-index': idx }}
                >
                  <div className="order-card-inner">
                    <header className="order-card-header">
                      <div className="restaurant-badge">
                        <span className="res-icon">🍜</span>
                        <span className="res-name">{order.restaurant}</span>
                      </div>
                      <div className="order-metadata">
                        <span className="order-id">{order.id}</span>
                        <span className="order-timestamp">{order.date} • {order.time}</span>
                      </div>
                    </header>
                    
                    <div className="order-card-body">
                      <div className="item-snapshots">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 3).map((item, index) => (
                            <div key={item.id || index} className="item-snapshot">
                              <div className="item-thumb">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = '🍽️';
                                    }}
                                  />
                                ) : (
                                  <span className="item-emoji">{item.icon || '🍽️'}</span>
                                )}
                                <span className="item-count">x{item.quantity}</span>
                              </div>
                              <div className="item-short-details">
                                <span className="item-n">{item.name}</span>
                                <span className="item-p">₹{(item.price || 0).toFixed(0)}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="no-items-msg">No item details available</p>
                        )}
                        {order.items && order.items.length > 3 && (
                          <div className="more-items">+{order.items.length - 3} more items</div>
                        )}
                      </div>
                    </div>

                    <footer className="order-card-footer">
                      <div className="order-summary-strip">
                        <div className="status-pill-wrapper">
                          <span className={`status-dot ${order.status.toLowerCase()}`}></span>
                          <span className={`status-text ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-price-total">
                          <span className="currency">₹</span>
                          <span className="amount">{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="order-action-bar">
                        <button
                          className="action-btn-sm tertiary"
                          onClick={() => handleViewDetails(order)}
                          title="View Details"
                        >
                          Details
                        </button>
                        <button
                          className="action-btn-sm secondary"
                          onClick={() => handleTrackOrder(order)}
                        >
                          <span className="btn-ico">🚴</span> Track
                        </button>
                        {(order.status || '').toLowerCase() === 'delivered' && (
                          <button
                            className="action-btn-sm primary"
                            onClick={() => handleReorder(order)}
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </footer>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders-state">
              <div className="empty-state-visual">
                <div className="empty-circle">
                  <span className="empty-ico">📋</span>
                </div>
                <div className="empty-decor dec-1"></div>
                <div className="empty-decor dec-2"></div>
              </div>
              <h3>No culinary adventures yet?</h3>
              <p>Your order history is currently empty. Start your journey with our delicious menu!</p>
              <button className="browse-menu-btn" onClick={() => navigate('/home')}>
                Explore Menu
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="homepage-footer">
          <p>© 2026 Onigiri - Delicious Food Delivery</p>
        </footer>
      </main>

      <HoveringCart />

      {/* Order Tracking Coming Soon Modal */}
      {showTrackingModal && (
        <div className="tracking-modal-overlay" onClick={() => setShowTrackingModal(false)}>
          <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="tracking-modal-close" onClick={() => setShowTrackingModal(false)}>✕</button>
            <div className="tracking-modal-icon">🚀</div>
            <h2 className="tracking-modal-title">Feature Coming Soon!</h2>
            <p className="tracking-modal-subtitle">
              Real-time order tracking for
              <strong> {trackedOrder?.id}</strong> is on its way!
            </p>
            <div className="tracking-steps">
              <div className="tracking-step done">✅ Order Placed</div>
              <div className="tracking-step done">✅ Confirmed</div>
              <div className="tracking-step upcoming">🍳 Preparing</div>
              <div className="tracking-step upcoming">🚴 On the Way</div>
              <div className="tracking-step upcoming">🏠 Delivered</div>
            </div>
            <p className="tracking-modal-note">We're building live tracking so you can follow your food every step of the way. Stay tuned!</p>
            <button className="tracking-modal-btn" onClick={() => setShowTrackingModal(false)}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
