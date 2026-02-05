import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getStoredUser, setStoredItem } from '../../utils/storageUtils';
import NotificationButton from '../../components/NotificationButton';
import HoveringCart from '../../components/HoveringCart';
import '../home/homepage.css';
import './OthersPage.css';
import logo from '../../assets/logo.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';
import userImage from '../../assets/user.png';

const OthersPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeNav, setActiveNav] = useState('others');
  
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

  // User settings state
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    smsAlerts: false,
    darkMode: false,
    language: 'english'
  });

  // User profile state
  const [profile, setProfile] = useState({
    name: userData.name || 'Guest User',
    email: userData.email || 'user@example.com',
    phone: '+91 98765 43210',
    address: 'Plot No. 42, Sector 5, CDA Building, Saheed Nagar, Bhubaneswar, Odisha 751019',
    paymentMethod: 'Credit Card'
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });

  const handleSettingChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleContactChange = (field, value) => {
    setContactForm({ ...contactForm, [field]: value });
  };

  const handleSaveProfile = () => {
    setStoredItem('user', {
      ...userData,
      ...profile
    });
    
    addNotification({
      type: 'settings',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      icon: '⚙️',
      action: '/others'
    });
    alert('Profile updated successfully!');
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) {
      alert('Please fill in all fields');
      return;
    }
    // Simulate API call
    console.log('Sending message:', contactForm);
    alert('Message sent successfully! We will get back to you shortly.');
    setContactForm({ subject: '', message: '' });
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    navigate('/login');
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
              <h3>Settings, {userName}!</h3>
              <p>Manage your account and preferences</p>
            </div>
          </div>
          <NotificationButton onClick={() => navigate('/notifications')} />
        </header>

        <div className="settings-container">
          {/* Profile Section */}
          <section className="settings-section">
            <h2 className="section-title">Profile Information</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="input-custom"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="input-custom"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="input-custom"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={profile.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  className="input-custom"
                  rows={3}
                />
              </div>
              <button className="order-btn" onClick={handleSaveProfile}>
                Save Profile
              </button>
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="settings-section">
            <h2 className="section-title">Contact Us</h2>
            <form className="settings-form contact-form" onSubmit={handleSendContact}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => handleContactChange('subject', e.target.value)}
                  className="input-custom"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleContactChange('message', e.target.value)}
                  className="input-custom"
                  placeholder="Describe your issue or feedback..."
                  rows={4}
                  required
                />
              </div>
              <button type="submit" className="order-btn">
                Send Message
              </button>
            </form>
          </section>

          {/* Notification Settings */}
          <section className="settings-section">
            <h2 className="section-title">Notification Preferences</h2>
            <div className="settings-form">
              <div className="setting-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                  <span>Push Notifications</span>
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                  />
                  <span>Email Updates</span>
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                  />
                  <span>SMS Alerts</span>
                </label>
              </div>
              <div className="setting-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  />
                  <span>Dark Mode</span>
                </label>
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="settings-section">
            <h2 className="section-title">Payment Methods</h2>
            <div className="payment-methods">
              <div className="payment-card">
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h4>Credit Card</h4>
                  <p>•••• •••• •••• 4242</p>
                </div>
                <button className="edit-btn">Edit</button>
              </div>
              <div className="payment-card">
                <div className="payment-icon">📱</div>
                <div className="payment-info">
                  <h4>UPI</h4>
                  <p>ankit@upi</p>
                </div>
                <button className="edit-btn">Edit</button>
              </div>
              <button className="add-payment-btn">
                <span>➕</span>
                Add Payment Method
              </button>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="settings-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">
                <span>🎫</span>
                <div>
                  <h4>Coupons</h4>
                  <p>View available coupons</p>
                </div>
              </button>
              <button className="action-btn">
                <span>📍</span>
                <div>
                  <h4>Saved Addresses</h4>
                  <p>Manage delivery addresses</p>
                </div>
              </button>
              <button className="action-btn">
                <span>❓</span>
                <div>
                  <h4>Help & Support</h4>
                  <p>Get help with your orders</p>
                </div>
              </button>
              <button className="action-btn">
                <span>📄</span>
                <div>
                  <h4>Terms & Privacy</h4>
                  <p>View terms and privacy policy</p>
                </div>
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="settings-section danger-zone">
            <h2 className="section-title">Account Actions</h2>
            <div className="danger-actions">
              <button className="danger-btn" onClick={() => alert('Clear cache functionality coming soon!')}>
                Clear Cache
              </button>
              <button className="danger-btn" onClick={() => alert('Delete account functionality coming soon!')}>
                Delete Account
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </section>
        </div>

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

export default OthersPage;
