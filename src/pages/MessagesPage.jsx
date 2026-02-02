import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import NotificationButton from '../components/NotificationButton';
import HoveringCart from '../components/HoveringCart';
import './homepage.css';
import './MessagesPage.css';
import logo from '../assets/logo.png';
import restaurantImage from '../assets/restaurant.png';
import heartImage from '../assets/heart.png';
import emailImage from '../assets/email.png';
import orderHistoryImage from '../assets/order-history.png';
import otherImage from '../assets/other.png';
import notificationImage from '../assets/notification.png';
import userImage from '../assets/user.png';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeNav, setActiveNav] = useState('messages');
  const [activeTab, setActiveTab] = useState('inbox');
  
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
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

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
      addNotification({
        type: 'system',
        title: 'Message Sent',
        message: 'Your message has been sent to customer support.',
        icon: '✉️'
      });
      alert('Message sent successfully!');
    }
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill all required fields');
      return;
    }
    
    // Simulate sending contact form
    addNotification({
      type: 'system',
      title: 'Contact Form Submitted',
      message: `Your inquiry about "${contactForm.subject}" has been received. We'll respond within 24 hours.`,
      icon: '📧'
    });
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
    
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
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
          <NotificationButton onClick={() => navigate('/notifications')} />
        </header>

        {/* Messages Section */}
        <section className="messages-section">
          {/* Tabs */}
          <div className="message-tabs" style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              className={`tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('inbox')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'inbox' ? '#4ecdc4' : 'transparent',
                color: activeTab === 'inbox' ? 'white' : '#6c757d',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Inbox
            </button>
            <button
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'contact' ? '#4ecdc4' : 'transparent',
                color: activeTab === 'contact' ? 'white' : '#6c757d',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Contact Us
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'inbox' ? (
            <div className="messages-container">
              {/* Messages List */}
              <div className="messages-list">
                <div className="inbox-header">
                  <h2 className="section-title">Inbox</h2>
                  <div className="inbox-actions">
                    <button className="mark-all-read-btn" onClick={() => {
                      setMessages(messages.map(msg => ({ ...msg, read: true })));
                      addNotification({
                        type: 'system',
                        title: 'All Messages Marked as Read',
                        message: 'All messages in your inbox have been marked as read.',
                        icon: '✅'
                      });
                    }}>
                      Mark All Read
                    </button>
                    <button className="clear-inbox-btn" onClick={() => {
                      setMessages([]);
                      addNotification({
                        type: 'system',
                        title: 'Inbox Cleared',
                        message: 'All messages have been removed from your inbox.',
                        icon: '🗑️'
                      });
                    }}>
                      Clear Inbox
                    </button>
                  </div>
                </div>
                
                <div className="messages-items">
                  {messages.length === 0 ? (
                    <div className="empty-inbox">
                      <div className="empty-inbox-icon">📭</div>
                      <h3>Your inbox is empty</h3>
                      <p>No new messages. Check back later for updates!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-item ${message.read ? 'read' : 'unread'} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="message-avatar">
                          {message.type === 'system' && (
                            <div className="avatar system-avatar">🏢</div>
                          )}
                          {message.type === 'order' && (
                            <div className="avatar order-avatar">📦</div>
                          )}
                          {message.type === 'promotion' && (
                            <div className="avatar promotion-avatar">🎉</div>
                          )}
                          {message.type === 'delivery' && (
                            <div className="avatar delivery-avatar">🚚</div>
                          )}
                          {message.type === 'customer' && (
                            <div className="avatar customer-avatar">👤</div>
                          )}
                          {!message.read && <div className="unread-indicator"></div>}
                        </div>
                        
                        <div className="message-content">
                          <div className="message-header">
                            <div className="message-sender-info">
                              <h4 className="sender-name">{message.sender}</h4>
                              <span className="message-category">{message.type}</span>
                            </div>
                            <div className="message-meta">
                              <span className="message-time">{message.time}</span>
                              <button 
                                className="message-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMessages(messages.filter(msg => msg.id !== message.id));
                                  addNotification({
                                    type: 'system',
                                    title: 'Message Deleted',
                                    message: `Message from ${message.sender} has been deleted.`,
                                    icon: '🗑️'
                                  });
                                }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <h5 className="message-subject">{message.subject}</h5>
                          <p className="message-preview">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message Detail */}
              <div className="message-detail">
                {selectedMessage ? (
                  <div className="message-full">
                    <div className="message-full-header">
                      <div className="message-full-avatar">
                        {selectedMessage.type === 'system' && (
                          <div className="avatar system-avatar large">🏢</div>
                        )}
                        {selectedMessage.type === 'order' && (
                          <div className="avatar order-avatar large">📦</div>
                        )}
                        {selectedMessage.type === 'promotion' && (
                          <div className="avatar promotion-avatar large">🎉</div>
                        )}
                        {selectedMessage.type === 'delivery' && (
                          <div className="avatar delivery-avatar large">🚚</div>
                        )}
                        {selectedMessage.type === 'customer' && (
                          <div className="avatar customer-avatar large">👤</div>
                        )}
                      </div>
                      <div className="message-full-info">
                        <h3>{selectedMessage.sender}</h3>
                        <div className="message-full-meta">
                          <span className="message-type-badge">{selectedMessage.type}</span>
                          <span className="message-time">{selectedMessage.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="message-full-content">
                      <h4>{selectedMessage.subject}</h4>
                      <div className="message-full-body">
                        {selectedMessage.message}
                      </div>
                    </div>
                    <div className="message-full-actions">
                      <button className="action-btn primary-btn">
                        <span>💬</span> Reply
                      </button>
                      <button className="action-btn secondary-btn">
                        <span>⭐</span> Star
                      </button>
                      <button className="action-btn danger-btn">
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="no-message-selected">
                    <div className="empty-state-icon">�</div>
                    <h3>Select a message</h3>
                    <p>Choose a message from the inbox to view details</p>
                  </div>
                )}
              </div>

              {/* New Message Section */}
              <div className="new-message-section">
                <div className="compose-header">
                  <h3>Compose New Message</h3>
                  <span className="compose-subtitle">Send us a message</span>
                </div>
                <div className="compose-form">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={4}
                    className="compose-textarea"
                  />
                  <div className="compose-actions">
                    <button className="action-btn secondary-btn">
                      <span>📎</span> Attach
                    </button>
                    <button className="action-btn primary-btn" onClick={handleSendMessage}>
                      <span>📤</span> Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          /* Contact Us Form */
          <div className="contact-form-container">
            <h2 className="section-title">Contact Us</h2>
            <form onSubmit={handleContactSubmit} className="contact-form" style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <div className="form-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Category</label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Related</option>
                  <option value="payment">Payment Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  placeholder="Brief description of your inquiry"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Message *</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                  rows={6}
                  placeholder="Please provide detailed information about your inquiry..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div className="form-actions" style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  className="order-btn"
                  style={{
                    background: '#4ecdc4',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setContactForm({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    category: 'general'
                  })}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
            
            <div className="contact-info" style={{
              marginTop: '40px',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ marginBottom: '16px' }}>Other Ways to Reach Us</h3>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <div style={{ margin: '16px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📞</div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                  <p style={{ fontSize: '12px', color: '#6c757d' }}>Mon-Sat, 9AM-9PM</p>
                </div>
                <div style={{ margin: '16px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✉️</div>
                  <h4>Email</h4>
                  <p>support@onigiri.com</p>
                  <p style={{ fontSize: '12px', color: '#6c757d' }}>24/7 Support</p>
                </div>
                <div style={{ margin: '16px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                  <h4>Live Chat</h4>
                  <p>Available on app</p>
                  <p style={{ fontSize: '12px', color: '#6c757d' }}>Instant help</p>
                </div>
              </div>
            </div>
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

export default MessagesPage;
