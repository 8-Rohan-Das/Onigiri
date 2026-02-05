import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useFavorites } from '../../context/FavoriteContext';
import { useCart } from '../../context/CartContext';
import NotificationButton from '../../components/NotificationButton';
import HoveringCart from '../../components/HoveringCart';
import './homepage.css';
import logo from '../../assets/logo.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';
import userImage from '../../assets/user.png';
import butterChickenImage from '../../assets/vecteezy_butter-chicken-with_25270174.png';
import sushiPlatterImage from '../../assets/vecteezy_sushi-platter-with-different-types-of-sushi_27735645.png';
import springRollsImage from '../../assets/vecteezy_a-plate-with-several-spring-rolls-and-a-small-bowl-of-sauce_53110058.png';

const FavoritePage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { addToCart } = useCart();
  const { favoriteItems, removeFromFavorites } = useFavorites();
  const [activeNav, setActiveNav] = useState('favorite');
  
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

  const handleRemoveFavorite = (id) => {
    removeFromFavorites(id);
  };

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price?.replace('₹', '') || 0),
      icon: item.icon || '🍽️'
    };
    
    addToCart(cartItem);
    
    addNotification({
      type: 'order',
      title: 'Added to Cart',
      message: `${item.name} has been added to your cart.`,
      icon: '🛒',
      action: '/home'
    });
  };

  const handleNavigateHome = () => {
    navigate('/home');
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
              <h3>Your Favorites, {userName}!</h3>
              <p>Quick access to your loved dishes</p>
            </div>
          </div>
          <NotificationButton onClick={() => navigate('/notifications')} />
        </header>

        {/* Favorites Section */}
        <section className="favorites-section">
          <h2 className="section-title">Your Favorite Dishes</h2>
          {favoriteItems.length > 0 ? (
            <div className="dishes-grid">
              {favoriteItems.map((item) => (
                <div key={item.id} className="dish-card">
                  <div className="dish-image">
                    {item.discount && <span className="dish-badge">{item.discount}</span>}
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="dish-emoji" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <span className="dish-emoji">{item.icon}</span>
                    )}
                  </div>
                  <div className="dish-info">
                    <h3 className="dish-name">{item.name || 'Unknown Item'}</h3>
                    <p className="dish-category">{item.category || 'Uncategorized'}</p>
                    <div className="dish-price">{item.price || '₹0'}</div>
                    <div className="dish-actions">
                      <button 
                        className="order-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFavorite(item.id)}
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginLeft: '8px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <div className="empty-icon">❤️</div>
              <h3>No favorites yet</h3>
              <p>Start adding your favorite dishes to see them here!</p>
              <button className="order-btn" onClick={() => navigate('/home')}>
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

export default FavoritePage;
