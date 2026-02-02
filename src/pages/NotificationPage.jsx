import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import './homepage.css';
import logo from '../assets/logo.png';
import restaurantImage from '../assets/restaurant.png';
import heartImage from '../assets/heart.png';
import emailImage from '../assets/email.png';
import orderHistoryImage from '../assets/order-history.png';
import otherImage from '../assets/other.png';
import notificationImage from '../assets/notification.png';
import userImage from '../assets/user.png';

const NotificationPage = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [activeNav, setActiveNav] = useState('notifications');
  
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      navigate(notification.action);
    }
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearAllNotifications();
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'order': '📦',
      'settings': '⚙️',
      'payment': '💳',
      'address': '📍',
      'favorite': '❤️',
      'promotion': '🎉',
      'system': '🏢'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'order': '#ff6b6b',
      'settings': '#4ecdc4',
      'payment': '#45b7d1',
      'address': '#96ceb4',
      'favorite': '#ff6b9d',
      'promotion': '#ffd93d',
      'system': '#6c5ce7'
    };
    return colors[type] || '#74b9ff';
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
              <h3>Notifications, {userName}!</h3>
              <p>Stay updated with your latest activities</p>
            </div>
          </div>
          <div className="notification-actions">
            {notifications.length > 0 && (
              <>
                <button 
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  style={{
                    background: '#4ecdc4',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    fontSize: '14px'
                  }}
                >
                  Mark All Read
                </button>
                <button 
                  className="clear-all-btn"
                  onClick={handleClearAll}
                  style={{
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </header>

        {/* Notifications Section */}
        <section className="notifications-section">
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    background: notification.read ? '#f8f9fa' : 'white',
                    border: `1px solid ${notification.read ? '#e9ecef' : getNotificationColor(notification.type)}`,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div className="notification-content" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div 
                      className="notification-icon"
                      style={{
                        fontSize: '24px',
                        marginRight: '16px',
                        minWidth: '24px'
                      }}
                    >
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-details" style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 4px 0', 
                        color: notification.read ? '#6c757d' : '#2d3436',
                        fontWeight: notification.read ? '400' : '600'
                      }}>
                        {notification.title}
                      </h4>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        {notification.message}
                      </p>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#adb5bd' 
                      }}>
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                    <button
                      className="delete-notification-btn"
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {!notification.read && (
                    <div 
                      className="unread-indicator"
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: getNotificationColor(notification.type),
                        borderRadius: '50%'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-notifications" style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
              <h3>No notifications yet</h3>
              <p>Start placing orders and updating your settings to see notifications here!</p>
              <button 
                className="order-btn"
                onClick={() => navigate('/home')}
                style={{ marginTop: '16px' }}
              >
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
    </div>
  );
};

export default NotificationPage;
