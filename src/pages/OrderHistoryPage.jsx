import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HoveringCart from '../components/HoveringCart';
import './homepage.css';
import './OrderHistoryPage.css'; // Import dedicated CSS
import logo from '../assets/logo.png';
import restaurantImage from '../assets/restaurant.png';
import heartImage from '../assets/heart.png';
import emailImage from '../assets/email.png';
import orderHistoryImage from '../assets/order-history.png';
import otherImage from '../assets/other.png';
import butterChickenImage from '../assets/vecteezy_butter-chicken-with_25270174.png';
import sushiPlatterImage from '../assets/vecteezy_sushi-platter-with-different-types-of-sushi_27735645.png';
import userImage from '../assets/user.png';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('order-history');
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
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
    try {
      // Get order history from localStorage
      const savedHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      
      // Also check for lastOrder and add it to history if not already there
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
      
      let allOrders = [...savedHistory];
      
      // Add lastOrder to history if it exists and isn't already included
      if (lastOrder && !allOrders.find(order => order.orderNumber === lastOrder.orderNumber)) {
        allOrders.unshift(lastOrder);
        // Update localStorage to include this order
        localStorage.setItem('orderHistory', JSON.stringify(allOrders));
        // Clear lastOrder since it's now in history
        localStorage.removeItem('lastOrder');
      }
      
      // Map saved orders to display format with error handling
      const formattedOrders = allOrders.map(order => {
        try {
          const dateDate = order.timestamp ? new Date(order.timestamp) : new Date();
          
          // Validate date
          if (isNaN(dateDate.getTime())) {
            console.warn('Invalid timestamp for order:', order.orderNumber);
            return null;
          }
          
          return {
            id: '#' + (order.orderNumber || Date.now()).toString().slice(-6),
            fullId: order.orderNumber,
            date: dateDate.toLocaleDateString(),
            time: dateDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: order.status || 'pending',
            items: Array.isArray(order.items) ? order.items : [],
            subtotal: order.subtotal || 0,
            deliveryFee: order.deliveryFee || 0,
            total: order.total || 0,
            restaurant: order.restaurant || 'Onigiri'
          };
        } catch (error) {
          console.error('Error processing order:', order, error);
          return null;
        }
      }).filter(order => order !== null); // Remove any null entries
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error loading order history:', error);
      setOrders([]); // Set empty array on error
    }
  }, []);

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleReorder = (order) => {
    alert(`Reordering items from ${order.id}`);
  };

  const handleViewDetails = (order) => {
    alert(`Viewing details for order ${order.id}`);
  };

  const handleLogout = () => {
    navigate('/login');
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
          <button className="notification-btn">🔔</button>
        </header>

        {/* Filter Section */}
        <section className="filter-section">
          <h2 className="section-title">Your Orders</h2>
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
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </footer>
      </main>

      <HoveringCart />
    </div>
  );
};

export default OrderHistoryPage;
