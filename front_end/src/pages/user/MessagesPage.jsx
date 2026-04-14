import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getStoredUser, removeStoredItem } from '../../utils/storageUtils.js';
import NotificationButton from '../../components/NotificationButton';
import HoveringCart from '../../components/HoveringCart';
import emailjs from '@emailjs/browser';
import '../home/homepage.css';
import './MessagesPage.css';
import logo from '../../assets/logo.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';

import userImage from '../../assets/user.png';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeNav, setActiveNav] = useState('messages');
  const [activeTab, setActiveTab] = useState('inbox');
  
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
  const [isSending, setIsSending] = useState(false);

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
    
    setIsSending(true);
    
    // EmailJS configuration
const serviceId = 'service_s1zzadk';
const templateId = 'template_ge1oq35';
const publicKey = '_RF0V4uUe6scOc1Gp';

const templateParams = {
  name: contactForm.name,
  email: contactForm.email,
  subject: contactForm.subject || 'No Subject',
  message: contactForm.message,
  category: contactForm.category,
  time: new Date().toLocaleString(),
};

emailjs.send(serviceId, templateId, templateParams, {
  publicKey: publicKey,
})
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        
        addNotification({
          type: 'system',
          title: 'Message Sent',
          message: `Your inquiry has been sent successfully. We'll respond within 24 hours.`,
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
        
        alert('Thank you for contacting us! Your message has been sent successfully.');
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Failed to send message. Please try again later or contact us directly.');
      })
      .finally(() => {
        setIsSending(false);
      });
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
                    <div className="empty-state-icon">📭</div>
                    <h3>Select a message</h3>
                    <p>Choose a message from the inbox to view details</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
          <div className="contact-page-wrapper">
            <header className="contact-page-header">
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">Have a question or feedback? We'd love to hear from you.</p>
            </header>
            
            <div className="contact-grid">
              <div className="contact-info-column">
                <div className="contact-info-card">
                  <h3>Contact Information</h3>
                  <p>Reach out to us through any of these channels. Our team is available to assist you.</p>
                  
                  <div className="contact-channels-list">
                    <div className="contact-channel-item">
                      <div className="channel-icon-wrapper phone">📞</div>
                      <div className="channel-details">
                        <h4>Phone</h4>
                        <p>+91 98765 43210</p>
                        <span className="channel-meta">Mon-Sat, 9AM-9PM</span>
                      </div>
                    </div>
                    
                    <div className="contact-channel-item">
                      <div className="channel-icon-wrapper email">✉️</div>
                      <div className="channel-details">
                        <h4>Email</h4>
                        <p>support@onigiri.com</p>
                        <span className="channel-meta">24/7 Support</span>
                      </div>
                    </div>
                    
                    <div className="contact-channel-item">
                      <div className="channel-icon-wrapper chat">💬</div>
                      <div className="channel-details">
                        <h4>Live Chat</h4>
                        <p>Available on our App</p>
                        <span className="channel-meta">Instant response</span>
                      </div>
                    </div>

                    <div className="contact-channel-item">
                      <div className="channel-icon-wrapper social">🌐</div>
                      <div className="channel-details">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                          <span></span> <span></span> <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-support-banner">
                  <div className="banner-icon">🚀</div>
                  <div className="banner-text">
                    <h4>Need urgent help?</h4>
                    <p>Check our <a href="#faq">FAQ section</a> for quick answers to common questions.</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-column">
                <form onSubmit={handleContactSubmit} className="contact-form-card">
                  <div className="form-header">
                    <h3>Send a Message</h3>
                    <p>Required fields are marked with *</p>
                  </div>
                  
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <label className="contact-label">Full Name *</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                        placeholder="John Doe"
                        className="contact-input"
                      />
                    </div>
                    <div className="contact-form-group">
                      <label className="contact-label">Email Address *</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                        placeholder="john@example.com"
                        className="contact-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="contact-form-group">
                      <label className="contact-label">Inquiry Category</label>
                      <div className="select-wrapper">
                        <select
                          value={contactForm.category}
                          onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                          className="contact-input contact-select"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Related</option>
                          <option value="payment">Payment Issue</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="complaint">Complaint</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="contact-form-group">
                    <label className="contact-label">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="What is this regarding?"
                      className="contact-input"
                    />
                  </div>
                  
                  <div className="contact-form-group">
                    <label className="contact-label">Message *</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="contact-input contact-textarea"
                    />
                  </div>
                  
                  <div className="contact-form-actions">
                    <button
                      type="submit"
                      className="contact-submit-btn"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <span className="btn-content">
                          <span className="loader"></span> Sending...
                        </span>
                      ) : (
                        <span className="btn-content">
                          Send Message <span>🚀</span>
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactForm({ name: '', email: '', subject: '', message: '', category: 'general' })}
                      className="contact-clear-btn"
                      disabled={isSending}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          )}
        </section>

        {/* Footer */}
        <footer className="homepage-footer">
          <p>© 2026 Onigiri - Delicious Food Delivery</p>
        </footer>
      </main>
    </div>
  );
};

export default MessagesPage;
