import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getStoredUser, setStoredItem, removeStoredItem } from '../../utils/storageUtils';
import { userAPI } from '../../services/api';
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
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    removeStoredItem('user');
    navigate('/login');
  };

  // Get user data from localStorage
  const userData = getStoredUser();
  const userName = userData.name || 'Guest User';

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
    language: 'english',
    locationSharing: true,
    biometricLogin: false,
    twoFactorAuth: false,
    dataPrivacy: 'standard'
  });

  // User profile state
  const [profile, setProfile] = useState({
    name: userData.name || 'Guest User',
    email: userData.email || 'user@example.com',
    phone: '+91 98765 43210',
    address: 'Plot No. 42, Sector 5, CDA Building, Saheed Nagar, Bhubaneswar, Odisha 751019',
    paymentMethod: 'Credit Card',
    dateOfBirth: '1995-06-15',
    gender: 'male',
    membership: 'Premium Member',
    profileImage: userData.profileImage || userImage,
    addresses: []
  });

  // Statistics state
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0.0,
    favoriteItems: 23,
    savedAddresses: 0,
    memberSince: 'Unknown',
    lastLogin: '2 hours ago'
  });

  // Loading state
  const [loading, setLoading] = useState(true);

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

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userData.id) {
          const response = await userAPI.getProfile(userData.id);
          const profileData = response.data;
          
          // Update profile state with backend data
          setProfile(prev => ({
            ...prev,
            name: profileData.name || prev.name,
            email: profileData.email || prev.email,
            phone: profileData.phone || prev.phone,
            dateOfBirth: profileData.dateOfBirth || prev.dateOfBirth,
            gender: profileData.gender || prev.gender,
            addresses: profileData.addresses || [],
            address: profileData.addresses && profileData.addresses.length > 0 
              ? `${profileData.addresses[0].street}, ${profileData.addresses[0].city}, ${profileData.addresses[0].state || ''} ${profileData.addresses[0].zipCode}, ${profileData.addresses[0].country || ''}`
              : prev.address
          }));
          
          // Update stats state with backend data
          setStats(prev => ({
            ...prev,
            totalOrders: profileData.totalOrders || 0,
            totalSpent: profileData.totalSpent || 0.0,
            memberSince: profileData.memberSince || 'Unknown',
            savedAddresses: profileData.addresses ? profileData.addresses.length : 0
          }));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        addNotification({
          type: 'error',
          title: 'Profile Load Error',
          message: 'Failed to load profile data from server.',
          icon: '⚠️',
          action: '/others'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userData.id, addNotification]);

  const handleSaveProfile = async () => {
    try {
      // Parse address string into address object for backend
      const addressParts = profile.address.split(',').map(part => part.trim());
      const newAddress = {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        zipCode: addressParts[3] || '',
        country: addressParts[4] || 'India'
      };

      // Update backend with all profile data
      await userAPI.updateProfile({
        userId: userData.id,
        name: profile.name,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        addresses: [newAddress]
      });

      // Update localStorage
      setStoredItem('user', {
        ...userData,
        ...profile
      });
      
      addNotification({
        type: 'settings',
        title: 'Profile Updated',
        message: 'Your profile information has been successfully updated.',
        icon: '✅',
        action: '/others'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
        icon: '❌',
        action: '/others'
      });
    }
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Sending message:', contactForm);
    addNotification({
      type: 'support',
      title: 'Message Sent',
      message: 'Your support request has been sent successfully.',
      icon: '📧',
      action: '/messages'
    });
    setContactForm({ subject: '', message: '' });
  };

  const handleAddPaymentMethod = () => {
    addNotification({
      type: 'settings',
      title: 'Payment Method',
      message: 'Add new payment method functionality coming soon!',
      icon: '💳',
      action: '/others'
    });
  };

  const handleAddAddress = () => {
    addNotification({
      type: 'settings',
      title: 'Address Management',
      message: 'Multiple address management coming soon!',
      icon: '📍',
      action: '/others'
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }

      // Create file reader to preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        openImageEditor(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageEditor = (imageUrl) => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Create editor container
    const editor = document.createElement('div');
    editor.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;

    // Create circular crop container (modern Instagram-style)
    const cropContainer = document.createElement('div');
    cropContainer.style.cssText = `
      position: relative;
      width: 300px;
      height: 300px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      background: #f0f0f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;

    // Create masked image container
    const maskedImageContainer = document.createElement('div');
    maskedImageContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      cursor: move;
    `;

    // Create image element
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: none;
      max-height: none;
      width: auto;
      height: auto;
      min-width: 100%;
      min-height: 100%;
      pointer-events: none;
    `;

    // Add image load event listener
    img.addEventListener('load', () => {
      console.log('Image loaded successfully');
      // Enable apply button once image is loaded
      const applyBtn = document.getElementById('apply-btn');
      if (applyBtn) {
        applyBtn.style.opacity = '1';
        applyBtn.style.cursor = 'pointer';
      }
    });

    // Add image error event listener
    img.addEventListener('error', () => {
      console.error('Failed to load image');
      addNotification({
        type: 'error',
        title: 'Image Load Error',
        message: 'Failed to load the selected image. Please try another image.',
        icon: '⚠️',
        action: '/others'
      });
    });

    // Create dark overlay outside circle
    const darkOverlay = document.createElement('div');
    darkOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: 2;
    `;

    // Create circular hole in dark overlay
    const circularHole = document.createElement('div');
    circularHole.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: transparent;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    `;

    // Create grid overlay
    const gridOverlay = document.createElement('div');
    gridOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      pointer-events: none;
      z-index: 3;
    `;

    // Create grid lines (rule of thirds)
    const gridLines = document.createElement('div');
    gridLines.innerHTML = `
      <div style="position: absolute; top: 33.33%; left: 0; right: 0; height: 1px; background: rgba(255, 255, 255, 0.3);"></div>
      <div style="position: absolute; top: 66.66%; left: 0; right: 0; height: 1px; background: rgba(255, 255, 255, 0.3);"></div>
      <div style="position: absolute; top: 0; bottom: 0; left: 33.33%; width: 1px; background: rgba(255, 255, 255, 0.3);"></div>
      <div style="position: absolute; top: 0; bottom: 0; left: 66.66%; width: 1px; background: rgba(255, 255, 255, 0.3);"></div>
      <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 255, 255, 0.3);"></div>
      <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: rgba(255, 255, 255, 0.3);"></div>
    `;

    // Create resize handles
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      background: var(--primary-color);
      border-radius: 50%;
      cursor: nwse-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
    `;
    resizeHandle.innerHTML = '↔';

    // Create controls
    const controls = document.createElement('div');
    controls.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
      margin-top: 20px;
    `;

    // Zoom controls
    const zoomContainer = document.createElement('div');
    zoomContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 15px;
      background: #f8f9fa;
      padding: 15px 20px;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
    `;
    zoomContainer.innerHTML = `
      <span style="font-weight: 600; color: #333; min-width: 60px;">Zoom</span>
      <input type="range" id="zoom-slider" min="50" max="300" value="100" style="flex: 1; height: 6px; background: #ddd; outline: none; border-radius: 3px;">
      <span id="zoom-value" style="min-width: 50px; font-weight: 600; color: var(--primary-color);">100%</span>
    `;

    // Action buttons
    const buttons = document.createElement('div');
    buttons.style.cssText = `
      display: flex;
      gap: 10px;
      justify-content: center;
    `;
    buttons.innerHTML = `
      <button id="rotate-btn" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Rotate</button>
      <button id="apply-btn" style="padding: 10px 20px; background: var(--success-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Apply</button>
      <button id="cancel-btn" style="padding: 10px 20px; background: var(--danger-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">Cancel</button>
    `;

    // Assemble controls
    controls.appendChild(zoomContainer);
    controls.appendChild(buttons);

    // Assemble editor with circular masking and grid
    gridOverlay.appendChild(gridLines);
    maskedImageContainer.appendChild(img);
    darkOverlay.appendChild(circularHole);
    cropContainer.appendChild(maskedImageContainer);
    cropContainer.appendChild(gridOverlay);
    cropContainer.appendChild(darkOverlay);
    editor.appendChild(cropContainer);
    editor.appendChild(controls);
    modal.appendChild(editor);
    document.body.appendChild(modal);

    let currentRotation = 0;
    let currentZoom = 100;
    let isDragging = false;
    let startX, startY, startWidth, startHeight;

    // State variables for dragging
    let imageX = 0;
    let imageY = 0;
    let dragStartX = 0;
    let dragStartY = 0;

    // Zoom functionality
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    zoomSlider.addEventListener('input', (e) => {
      currentZoom = e.target.value;
      zoomValue.textContent = `${currentZoom}%`;
      updateImageTransform();
    });

    // Dragging functionality
    maskedImageContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX - imageX;
      dragStartY = e.clientY - imageY;
      maskedImageContainer.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      imageX = e.clientX - dragStartX;
      imageY = e.clientY - dragStartY;
      
      // Constrain to circle bounds
      const maxOffset = (300 * currentZoom / 100) / 2 - 50;
      imageX = Math.max(-maxOffset, Math.min(maxOffset, imageX));
      imageY = Math.max(-maxOffset, Math.min(maxOffset, imageY));
      
      updateImageTransform();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      maskedImageContainer.style.cursor = 'move';
    });

    // Rotate functionality
    document.getElementById('rotate-btn').addEventListener('click', () => {
      currentRotation += 90;
      updateImageTransform();
    });

    // Update image transform function
    function updateImageTransform() {
      img.style.transform = `translate(${imageX}px, ${imageY}px) rotate(${currentRotation}deg) scale(${currentZoom / 100})`;
    }

    // Apply functionality
    document.getElementById('apply-btn').addEventListener('click', () => {
      // Ensure image is loaded before processing
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        addNotification({
          type: 'error',
          title: 'Image Not Loaded',
          message: 'Please wait for the image to load before applying changes.',
          icon: '⚠️',
          action: '/others'
        });
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas to circular size (300px for perfect circle)
      const circleSize = 300;
      canvas.width = circleSize;
      canvas.height = circleSize;
      
      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      
      // Apply transformations and draw within circle
      ctx.translate(circleSize / 2, circleSize / 2);
      ctx.rotate((currentRotation * Math.PI) / 180);
      ctx.scale(currentZoom / 100, currentZoom / 100);
      
      // Calculate image size to fit in circle with current position
      const imgSize = Math.max(img.naturalWidth, img.naturalHeight) * (currentZoom / 100);
      const scaledWidth = img.naturalWidth * (currentZoom / 100);
      const scaledHeight = img.naturalHeight * (currentZoom / 100);
      
      // Draw image with current position and transformations
      ctx.drawImage(img, 
        -scaledWidth / 2 + imageX, 
        -scaledHeight / 2 + imageY, 
        scaledWidth, 
        scaledHeight
      );
      ctx.restore();
      
      // Convert to data URL and update profile
      const circularImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setProfile({ ...profile, profileImage: circularImageUrl });
      
      addNotification({
        type: 'settings',
        title: 'Profile Picture Updated',
        message: 'Your profile picture has been cropped to a perfect circle and updated successfully.',
        icon: '📷',
        action: '/others'
      });
      
      document.body.removeChild(modal);
    });

    // Cancel functionality
    document.getElementById('cancel-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
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
              <h3>Welcome, {userName}!</h3>
              <p>Manage your account and preferences</p>
            </div>
          </div>
          <NotificationButton onClick={() => navigate('/notifications')} />
        </header>

        <div className="settings-container">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              📊 Statistics
            </button>
            <button 
              className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              📧 Support
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <section className="settings-section">
                <h2 className="section-title">Profile Information</h2>
                <div className="profile-header">
                  <div className="profile-card">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar">
                        <img src={profile.profileImage} alt="Profile" />
                      </div>
                      <div className="profile-actions">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="avatar-input"
                          id="side-photo-input"
                        />
                        <label htmlFor="side-photo-input" className="side-change-btn">
                          Change Profile Picture
                        </label>
                      </div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-header-info">
                        <h3>{profile.name}</h3>
                        <p className="profile-email">{profile.email}</p>
                        <div className="profile-badges">
                          <span className="badge premium">{profile.membership}</span>
                          <span className="badge verified">Verified</span>
                        </div>
                      </div>
                      <div className="profile-stats">
                        <div className="stat-item">
                          <span className="stat-label">Member Since</span>
                          <span className="stat-value">{loading ? 'Loading...' : stats.memberSince}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Total Orders</span>
                          <span className="stat-value">{loading ? 'Loading...' : stats.totalOrders}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Total Spent</span>
                          <span className="stat-value">{loading ? 'Loading...' : `₹${stats.totalSpent.toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="settings-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
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
                  </div>
                  
                  <div className="form-row">
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
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                        className="input-custom"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={profile.gender === 'male'}
                          onChange={(e) => handleProfileChange('gender', e.target.value)}
                        />
                        Male
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={profile.gender === 'female'}
                          onChange={(e) => handleProfileChange('gender', e.target.value)}
                        />
                        Female
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={profile.gender === 'other'}
                          onChange={(e) => handleProfileChange('gender', e.target.value)}
                        />
                        Other
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      className="input-custom"
                      rows="3"
                    />
                  </div>

                  <button className="save-btn" onClick={handleSaveProfile}>
                    💾 Save Profile
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <section className="settings-section">
                <h2 className="section-title">Preferences</h2>
                <div className="settings-form">
                  <div className="setting-item">
                    <label>🔔 Push Notifications</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      />
                      <span>Receive order updates and alerts</span>
                    </div>
                  </div>

                  <div className="setting-item">
                    <label>📧 Email Updates</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={settings.emailUpdates}
                        onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                      />
                      <span>Weekly newsletter and promotions</span>
                    </div>
                  </div>

                  <div className="setting-item">
                    <label>📱 SMS Alerts</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={settings.smsAlerts}
                        onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                      />
                      <span>Order status via SMS</span>
                    </div>
                  </div>

                  <div className="setting-item">
                    <label>🌙 Dark Mode</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      />
                      <span>Easier on the eyes</span>
                    </div>
                  </div>

                  <div className="setting-item">
                    <label>🌍 Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="input-custom"
                    >
                      <option value="english">English</option>
                      <option value="hindi">हिंदी</option>
                      <option value="odia">ଓଡ଼ିଆ</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <label>🔐 Two-Factor Auth</label>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      />
                      <span>Extra security layer</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <h2 className="section-title">Security</h2>
                <div className="security-options">
                  <button className="security-btn" onClick={() => alert('Change password functionality coming soon!')}>
                    🔑 Change Password
                  </button>
                  <button className="security-btn" onClick={() => alert('Enable 2FA functionality coming soon!')}>
                    🔐 Enable Two-Factor Auth
                  </button>
                  <button className="security-btn" onClick={() => alert('Privacy settings coming soon!')}>
                    🛡️ Privacy Settings
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="tab-content">
              <section className="settings-section">
                <h2 className="section-title">Your Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                      <h3>{stats.totalOrders}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <h3>₹{stats.totalSpent.toFixed(2)}</h3>
                      <p>Total Spent</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-info">
                      <h3>{stats.favoriteItems}</h3>
                      <p>Favorite Items</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-info">
                      <h3>{stats.savedAddresses}</h3>
                      <p>Saved Addresses</p>
                    </div>
                  </div>
                </div>

                <div className="stats-details">
                  <div className="detail-item">
                    <span className="detail-label">Member Since:</span>
                    <span className="detail-value">{stats.memberSince}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Login:</span>
                    <span className="detail-value">{stats.lastLogin}</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="tab-content">
              <section className="settings-section">
                <h2 className="section-title">Payment Methods</h2>
                <div className="payment-methods">
                  <div className="payment-card">
                    <div className="payment-icon">💳</div>
                    <div className="payment-info">
                      <h4>Credit Card</h4>
                      <p>••••• •••• •••• 4242</p>
                      <button className="edit-btn" onClick={() => alert('Edit payment method coming soon!')}>Edit</button>
                    </div>
                  </div>
                  <button className="add-payment-btn" onClick={handleAddPaymentMethod}>
                    ➕ Add Payment Method
                  </button>
                </div>
              </section>

              <section className="settings-section">
                <h2 className="section-title">Saved Addresses</h2>
                <div className="address-list">
                  <div className="address-item">
                    <div className="address-info">
                      <h4>Home</h4>
                      <p>{profile.address}</p>
                    </div>
                    <button className="edit-btn" onClick={() => alert('Edit address coming soon!')}>Edit</button>
                  </div>
                </div>
                <button className="add-address-btn" onClick={handleAddAddress}>
                  ➕ Add New Address
                </button>
              </section>

              <section className="settings-section">
                <h2 className="section-title">Contact Support</h2>
                <div className="contact-form">
                  <div className="form-group">
                    <label>Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => handleContactChange('subject', e.target.value)}
                      className="input-custom"
                    >
                      <option value="">Select a topic</option>
                      <option value="order_issue">Order Issue</option>
                      <option value="payment_problem">Payment Problem</option>
                      <option value="account_help">Account Help</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="bug_report">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => handleContactChange('message', e.target.value)}
                      className="input-custom"
                      rows="5"
                      placeholder="Describe your issue or request in detail..."
                    />
                  </div>
                  <button className="send-btn" onClick={handleSendContact}>
                    📧 Send Message
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Account Actions */}
          <section className="settings-section danger-zone">
            <h2 className="section-title">Account Actions</h2>
            <div className="danger-actions">
              <button className="danger-btn" onClick={() => alert('Export data functionality coming soon!')}>
                📥 Export Data
              </button>
              <button className="danger-btn" onClick={() => alert('Delete account functionality coming soon!')}>
                🗑️ Delete Account
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="homepage-footer">
          <p>© 2026 Onigiri - Delicious Food Delivery</p>
        </footer>
      </main>
      
      <HoveringCart />
    </div>
  );
};

export default OthersPage;
