import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getStoredItem, setStoredItem, removeStoredItem } from '../../utils/storageUtils.js';

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
    { id: 'others', label: 'Others', image: otherImage },
  ];

  // Order history data
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log('OrderHistoryPage: Component mounted or updated');
    
    const loadOrders = () => {
      try {
        console.log('OrderHistoryPage: Loading orders...');
        
        // Get order history from localStorage
        const savedHistory = getStoredItem('orderHistory', []);
        console.log('OrderHistoryPage: savedHistory from storage:', savedHistory);
        
        // Get last order and merge if needed
        const lastOrder = getStoredItem('lastOrder');
        console.log('OrderHistoryPage: lastOrder from storage:', lastOrder);
        
        let allOrders = Array.isArray(savedHistory) ? savedHistory : [];
        
        // Add lastOrder if it exists and isn't already in the history
        if (lastOrder && !allOrders.find(order => order.orderNumber === lastOrder.orderNumber)) {
          console.log('OrderHistoryPage: Adding lastOrder to history');
          allOrders.unshift(lastOrder);
          // Save the updated history
          setStoredItem('orderHistory', allOrders);
          // Remove lastOrder since it's now in history
          removeStoredItem('lastOrder');
        }
        
        // Format orders for display
        const formattedOrders = allOrders.map(order => ({
          id: '#' + (order.orderNumber || Date.now()).toString().slice(-6),
          fullId: order.orderNumber,
          date: order.timestamp ? new Date(order.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
          time: order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: order.status || 'pending',
          items: Array.isArray(order.items) ? order.items : [],
          subtotal: order.subtotal || 0,
          deliveryFee: order.deliveryFee || 0,
          total: order.total || 0,
          restaurant: order.restaurant || 'Onigiri'
        }));
        
        console.log('OrderHistoryPage: Setting formatted orders:', formattedOrders);
        setOrders(formattedOrders);
        
      } catch (error) {
        console.error('OrderHistoryPage: Error loading orders:', error);
        setOrders([]);
      }
    };

    // Load orders immediately
    loadOrders();
    
    // Set up a simple interval to check for new orders
    const interval = setInterval(loadOrders, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []); // Only run on mount

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  console.log('OrderHistoryPage: Current orders state:', orders);
  console.log('OrderHistoryPage: Filtered orders:', filteredOrders);

  const handleReorder = (order) => {
    alert(`Reordering items from ${order.id}`);
  };

  const handleViewDetails = (order) => {
    alert(`Viewing details for order ${order.id}`);
  };

  const handleTrackOrder = (order) => {
    setTrackedOrder(order);
    setShowTrackingModal(true);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      removeStoredItem('orderHistory');
      removeStoredItem('lastOrder');
      setOrders([]);
      alert('Order history cleared successfully!');
    }
  };


  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#00c851';
      case 'cancelled': return '#ff4444';
      case 'pending': return '#ffaa00';
      default: return '#666';
    }
  };

  return (
    <div className="homepage-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
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
        <section className="filter-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2 className="section-title">Your Orders</h2>
            <button 
              className="filter-btn"
              onClick={handleClearHistory}
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              🗑️ Clear History
            </button>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilterStatus('delivered')}
            >
              Delivered
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </section>

        {/* Orders Grid */}
        <section className="orders-history-section">
          {filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <span className="restaurant-name">{order.restaurant}</span>
                      <h3>{order.id}</h3>
                      <span className="order-date">{order.date} • {order.time}</span>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status || 'pending') }}
                      >
                        {order.status || 'pending'}
                      </span>
                      <span className="order-total-badge">₹{(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={item.id || index} className="order-item">
                          <span className="item-icon">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name || 'Item'} 
                                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = item.icon || '🍽️';
                                }}
                              />
                            ) : (
                              item.icon || '🍽️'
                            )}
                          </span>
                          <span className="item-name">{item.name || 'Unknown Item'}</span>
                          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="item-quantity">x{item.quantity || 1}</span>
                            <span className="item-price">₹{(item.price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="order-item">
                        <span className="item-name">No items details available</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="order-btn btn-secondary"
                      onClick={() => handleViewDetails(order)}
                    >
                      Details
                    </button>
                    <button
                      className="order-btn btn-track"
                      onClick={() => handleTrackOrder(order)}
                    >
                      🚴 Track Order
                    </button>
                    {order.status === 'delivered' && (
                      <button 
                        className="order-btn btn-primary"
                        onClick={() => handleReorder(order)}
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-orders">
              <div className="empty-icon">📋</div>
              <h3>No orders found</h3>
              <p>No orders match the selected filter</p>
              <button className="order-btn btn-primary" onClick={() => navigate('/home')}>
                Browse Menu
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
