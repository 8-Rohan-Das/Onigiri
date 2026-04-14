import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getStoredUser, setStoredItem, removeStoredItem } from '../../utils/storageUtils';
import { userAPI } from '../../services/api';
import NotificationButton from '../../components/NotificationButton';
import HoveringCart from '../../components/HoveringCart';
import PopupModal from '../../components/PopupModal';
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

  const handleLogout = () => {
    showPopup(
      'confirm',
      'Logout Confirmation',
      'Are you sure you want to logout? You will need to login again to access your account.',
      () => {
        removeStoredItem('user');
        navigate('/login');
      }
    );
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
    addresses: [],
    // Structured address fields
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
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

  // Popup Modal State
  const [popupModal, setPopupModal] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
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

  // Popup helper functions
  const showPopup = (type, title, message, onConfirm = null) => {
    setPopupModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  };

  const closePopup = () => {
    setPopupModal(prev => ({ ...prev, isOpen: false }));
  };

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userData.id) {
          const response = await userAPI.getProfile(userData.id);
          const profileData = response.data;
          
          // Update profile state with backend data
          const primaryAddress = profileData.addresses && profileData.addresses.length > 0 
            ? profileData.addresses[0] 
            : {};
          
          setProfile(prev => ({
            ...prev,
            name: profileData.name || prev.name,
            email: profileData.email || prev.email,
            phone: profileData.phone || prev.phone,
            dateOfBirth: profileData.dateOfBirth || prev.dateOfBirth,
            gender: profileData.gender || prev.gender,
            addresses: profileData.addresses || [],
            address: primaryAddress.street 
              ? `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state || ''} ${primaryAddress.zipCode}, ${primaryAddress.country || 'India'}`
              : prev.address,
            // Populate structured address fields
            street: primaryAddress.street || '',
            city: primaryAddress.city || '',
            state: primaryAddress.state || '',
            zipCode: primaryAddress.zipCode || '',
            country: primaryAddress.country || 'India'
          }));
          
          // Update stats state with backend data
          const memberSince = profileData.memberSince || profileData.createdAt 
            ? new Date(profileData.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })
            : 'January 2024'; // Fallback date for existing users
          
          setStats(prev => ({
            ...prev,
            totalOrders: profileData.totalOrders || 0,
            totalSpent: profileData.totalSpent || 0.0,
            memberSince: memberSince,
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

  const handleSaveProfile = () => {
    // Validate required address fields
    if (!profile.street.trim() || !profile.city.trim() || !profile.zipCode.trim()) {
      addNotification({
        type: 'error',
        title: 'Address Validation',
        message: 'Please fill in Street, City, and Zip Code fields.',
        icon: ' warning ',
        action: '/others'
      });
      return;
    }

    // Show confirmation popup
    showPopup(
      'confirm',
      'Save Profile Changes',
      `Are you sure you want to save your profile changes? This will update your personal information and address.`,
      async () => {
        try {
          // Create address object from structured fields
          const newAddress = {
            street: profile.street.trim(),
            city: profile.city.trim(),
            state: profile.state.trim(),
            zipCode: profile.zipCode.trim(),
            country: profile.country.trim()
          };

          console.log('Structured address object:', newAddress);

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
            icon: ' success ',
            action: '/others'
          });

          // Show success popup
          showPopup(
            'success',
            'Profile Saved Successfully!',
            'Your profile changes have been saved and will take effect immediately.'
          );
        } catch (error) {
          console.error('Error updating profile:', error);
          addNotification({
            type: 'error',
            title: 'Update Failed',
            message: 'Failed to update profile. Please try again.',
            icon: ' error ',
            action: '/others'
          });

          // Show error popup
          showPopup(
            'error',
            'Profile Update Failed',
            'There was an error saving your profile changes. Please check your connection and try again.'
          );
        }
      }
    );
  };

  const handleSendContact = (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) {
      showPopup(
        'warning',
        'Missing Information',
        'Please fill in both subject and message fields before sending.'
      );
      return;
    }
    
    showPopup(
      'confirm',
      'Send Support Message',
      `Are you sure you want to send this support message? Our team will respond to: ${profile.email}`,
      () => {
        console.log('Sending message:', contactForm);
        addNotification({
          type: 'support',
          title: 'Message Sent',
          message: 'Your support request has been sent successfully.',
          icon: ' email ',
          action: '/messages'
        });
        setContactForm({ subject: '', message: '' });
        
        // Show success popup
        showPopup(
          'success',
          'Message Sent Successfully!',
          'Your support request has been received. We will get back to you within 24 hours.'
        );
      }
    );
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
                  <label>Address Information</label>
                  <div className="address-fields">
                    <div className="form-row">
                      <div className="form-group address-street">
                        <label>Street Address *</label>
                        <input
                          type="text"
                          value={profile.street}
                          onChange={(e) => handleProfileChange('street', e.target.value)}
                          className="input-custom"
                          placeholder="123 Main St, Apt 4B"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group address-city">
                        <label>City *</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => handleProfileChange('city', e.target.value)}
                          className="input-custom"
                          placeholder="New York"
                          required
                        />
                      </div>
                      
                      <div className="form-group address-state">
                        <label>State</label>
                        <input
                          type="text"
                          value={profile.state}
                          onChange={(e) => handleProfileChange('state', e.target.value)}
                          className="input-custom"
                          placeholder="NY"
                        />
                      </div>
                      
                      <div className="form-group address-zip">
                        <label>ZIP Code *</label>
                        <input
                          type="text"
                          value={profile.zipCode}
                          onChange={(e) => handleProfileChange('zipCode', e.target.value)}
                          className="input-custom"
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group address-country">
                        <label>Country</label>
                        <input
                          type="text"
                          value={profile.country}
                          onChange={(e) => handleProfileChange('country', e.target.value)}
                          className="input-custom"
                          placeholder="India"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="save-btn" onClick={handleSaveProfile}>
                  💾 Save Profile
                </button>
              </div>
            </section>
          </div>

          {/* Account Actions */}
          <section className="settings-section danger-zone">
            <h2 className="section-title">Account Actions</h2>
            <div className="danger-actions">
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
      
      {/* Popup Modal */}
      <PopupModal
        isOpen={popupModal.isOpen}
        onClose={closePopup}
        type={popupModal.type}
        title={popupModal.title}
        message={popupModal.message}
        onConfirm={popupModal.onConfirm}
      />
    </div>
  );
};

export default OthersPage;
