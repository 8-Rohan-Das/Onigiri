import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getStoredUser, removeStoredItem } from '../../utils/storageUtils.js';
import '../home/homepage.css';
import './NotificationPage.css';
import logo from '../../assets/logo.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';

import userImage from '../../assets/user.png';

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
    // Clear user data from localStorage safely
    removeStoredItem('user');
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
              <h3>Notifications, {userName}!</h3>
              <p>Stay updated with your latest activities</p>
            </div>
          </div>
          <div className="notif-header-actions">
            {notifications.length > 0 && (
              <>
                <button
                  className="notif-mark-all-btn"
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </button>
                <button
                  className="notif-clear-all-btn"
                  onClick={handleClearAll}
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
                  className={`notif-item ${notification.read ? 'notif-read' : 'notif-unread'}`}
                  style={{ borderColor: notification.read ? undefined : getNotificationColor(notification.type) }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notif-content">
                    <div className="notif-icon">
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="notif-details">
                      <h4 className={`notif-title ${notification.read ? 'notif-title-read' : 'notif-title-unread'}`}>
                        {notification.title}
                      </h4>
                      <p className="notif-message">{notification.message}</p>
                      <span className="notif-time">{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                    <button
                      className="notif-delete-btn"
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                    >
                      ×
                    </button>
                  </div>
                  {!notification.read && (
                    <div
                      className="notif-unread-dot"
                      style={{ backgroundColor: getNotificationColor(notification.type) }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="notif-empty">
              <div className="notif-empty-icon">🔔</div>
              <h3>No notifications yet</h3>
              <p>Start placing orders and updating your settings to see notifications here!</p>
              <button
                className="order-btn notif-browse-btn"
                onClick={() => navigate('/home')}
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
