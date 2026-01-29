import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
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
  const [orders, setOrders] = useState([
    {
      id: '#12345',
      date: '2024-01-20',
      time: '7:30 PM',
      status: 'delivered',
      items: [
        { name: 'Butter Chicken', quantity: 1, price: 189, image: butterChickenImage },
        { name: 'Naan Bread', quantity: 2, price: 40, icon: '🫓' }
      ],
      subtotal: 269,
      deliveryFee: 40,
      total: 309,
      restaurant: 'Spice Garden'
    },
    {
      id: '#12344',
      date: '2024-01-18',
      time: '1:15 PM',
      status: 'delivered',
      items: [
        { name: 'Sushi Platter', quantity: 1, price: 259, image: sushiPlatterImage },
        { name: 'Miso Soup', quantity: 1, price: 89, icon: '🍜' }
      ],
      subtotal: 348,
      deliveryFee: 40,
      total: 388,
      restaurant: 'Sakura Sushi'
    },
    {
      id: '#12343',
      date: '2024-01-15',
      time: '8:45 PM',
      status: 'cancelled',
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 180 },
        { name: 'Garlic Bread', quantity: 1, price: 60, icon: '🍞' }
      ],
      subtotal: 240,
      deliveryFee: 40,
      total: 280,
      restaurant: 'Pizza Palace'
    },
    {
      id: '#12342',
      date: '2024-01-12',
      time: '6:00 PM',
      status: 'delivered',
      items: [
        { name: 'Spring Rolls', quantity: 2, price: 149, icon: '🍱' },
        { name: 'Manchurian', quantity: 1, price: 119, icon: '🥟' }
      ],
      subtotal: 417,
      deliveryFee: 40,
      total: 457,
      restaurant: 'Dragon Wok'
    }
  ]);

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

  const handleNavigateHome = () => {
    navigate('/home');
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
              All Orders ({orders.length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilterStatus('delivered')}
            >
              Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              Cancelled ({orders.filter(o => o.status === 'cancelled').length})
            </button>
          </div>
        </section>

        {/* Orders List */}
        <section className="orders-history-section">
          {filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>{order.id}</h3>
                      <p>{order.restaurant}</p>
                      <p>{order.date} at {order.time}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="order-total">₹{order.total}</div>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-icon">
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{width: '20px', height: '20px', objectFit: 'cover'}} />
                          ) : (
                            item.icon
                          )}
                        </span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee:</span>
                      <span>₹{order.deliveryFee}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="order-btn"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button 
                        className="order-btn"
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
              <button className="order-btn" onClick={() => navigate('/home')}>
                Order Food
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
    </div>
  );
};

export default OrderHistoryPage;
