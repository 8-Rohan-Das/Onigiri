import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HoveringCart from '../components/HoveringCart';
import './homepage.css';
import logo from '../assets/logo.png';
import restaurantImage from '../assets/restaurant.png';
import heartImage from '../assets/heart.png';
import emailImage from '../assets/email.png';
import orderHistoryImage from '../assets/order-history.png';
import otherImage from '../assets/other.png';
import userImage from '../assets/user.png';

const MessagesPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('messages');
  
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

  // Messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Onigiri Support',
      subject: 'Welcome to Onigiri!',
      message: 'Thank you for joining us. Enjoy 20% off your first order!',
      time: '2 hours ago',
      read: false,
      type: 'system'
    },
    {
      id: 2,
      sender: 'Restaurant Partner',
      subject: 'Order Confirmation',
      message: 'Your order #12345 has been confirmed and will be delivered soon.',
      time: '5 hours ago',
      read: false,
      type: 'order'
    },
    {
      id: 3,
      sender: 'Onigiri Team',
      subject: 'Special Offer',
      message: 'Get free delivery on orders above ₹299 this weekend!',
      time: '1 day ago',
      read: true,
      type: 'promotion'
    },
    {
      id: 4,
      sender: 'Delivery Partner',
      subject: 'Delivery Update',
      message: 'Your order is on the way and will arrive in 15 minutes.',
      time: '2 days ago',
      read: true,
      type: 'delivery'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    // Mark as read
    setMessages(messages.map(msg => 
      msg.id === message.id ? { ...msg, read: true } : msg
    ));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        subject: 'Customer Support',
        message: newMessage,
        time: 'Just now',
        read: true,
        type: 'customer'
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
      alert('Message sent successfully!');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/home');
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
              <h3>Messages, {userName}!</h3>
              <p>Stay updated with your orders and offers</p>
            </div>
          </div>
          <button className="notification-btn">🔔</button>
        </header>

        {/* Messages Section */}
        <section className="messages-section">
          <div className="messages-container">
            {/* Messages List */}
            <div className="messages-list">
              <h2 className="section-title">Inbox</h2>
              <div className="messages-items">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${message.read ? 'read' : 'unread'} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="message-icon">
                      {message.type === 'system' && '🏢'}
                      {message.type === 'order' && '📦'}
                      {message.type === 'promotion' && '🎉'}
                      {message.type === 'delivery' && '🚚'}
                      {message.type === 'customer' && '👤'}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <h4>{message.sender}</h4>
                        <span className="message-time">{message.time}</span>
                      </div>
                      <h5>{message.subject}</h5>
                      <p>{message.message}</p>
                    </div>
                    {!message.read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="message-detail">
              {selectedMessage ? (
                <div className="message-full">
                  <div className="message-full-header">
                    <div className="message-full-icon">
                      {selectedMessage.type === 'system' && '🏢'}
                      {selectedMessage.type === 'order' && '📦'}
                      {selectedMessage.type === 'promotion' && '🎉'}
                      {selectedMessage.type === 'delivery' && '🚚'}
                      {selectedMessage.type === 'customer' && '👤'}
                    </div>
                    <div>
                      <h3>{selectedMessage.sender}</h3>
                      <p>{selectedMessage.time}</p>
                    </div>
                  </div>
                  <h4>{selectedMessage.subject}</h4>
                  <p>{selectedMessage.message}</p>
                  
                  <div className="message-actions">
                    <button className="order-btn">Reply</button>
                    <button className="order-btn" style={{ background: '#ff4444' }}>Delete</button>
                  </div>
                </div>
              ) : (
                <div className="no-message-selected">
                  <div className="empty-icon">💬</div>
                  <h3>Select a message</h3>
                  <p>Choose a message from the inbox to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* New Message Section */}
          <div className="new-message-section">
            <h3>Send us a message</h3>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <button className="order-btn" onClick={handleSendMessage}>
              Send Message
            </button>
          </div>
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

export default MessagesPage;
