import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, removeStoredItem } from '../../utils/storageUtils.js';
import { useFavorites } from '../../context/FavoriteContext';
import { useCart } from '../../context/CartContext';
import './homepage.css';
import NotificationButton from '../../components/NotificationButton';
import PremiumFavoriteButton from '../../components/PremiumFavoriteButton';
import HoveringCart from '../../components/HoveringCart';
import ThemeToggle from '../../components/ThemeToggle';
// Removing external dependency to fix import error
// import { FiSearch, FiX } from 'react-icons/fi'; 
import logo from '../../assets/logo.png';
import butterChickenImage from '../../assets/vecteezy_butter-chicken-with_25270174.png';
import sushiPlatterImage from '../../assets/vecteezy_sushi-platter-with-different-types-of-sushi_27735645.png';
import springRollsImage from '../../assets/vecteezy_a-plate-with-several-spring-rolls-and-a-small-bowl-of-sauce_53110058.png';
import manchurianSoupImage from '../../assets/vecteezy_chili-soup-in-a-bowl-on-a-transparent-background_57754847.png';
import dimSumImage from '../../assets/vecteezy_ai-generated-steamed-stuff-custard-bun-in-bamboo-basket-png_35675661.png';
import pekingDuckImage from '../../assets/vecteezy_peking-duck-png-with-ai-generated_26758795.png';
import kungPaoImage from '../../assets/vecteezy_spicy-kung-pao-chicken-a-fiery-sichuan-favorite-with_47072686.png';
import tempuraImage from '../../assets/vecteezy_golden-fried-shrimp-tempura-on-white-plate_50278149.png';
import biryaniImage from '../../assets/vecteezy_ai-generated-delicious-dum-handi-biryani-in-bowl-isolated-on_41856072.png';
import burgerImage from '../../assets/icons8-burger-100.png';
import pizzaImage from '../../assets/pizza.png';
import biryaniCategoryImage from '../../assets/biryani.png';
import parathaImage from '../../assets/paratha.png';
import cakeImage from '../../assets/cake.png';
import springRollsCategoryImage from '../../assets/spring-rolls.png';
import noodlesImage from '../../assets/noodles.png';
import choleBhatureImage from '../../assets/chole-bhature.png';
import notificationImage from '../../assets/notification.png';
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';
import userImage from '../../assets/user.png';
import favouriteIcon from '../../assets/favourite.svg';

const Homepage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { addToFavorites, isFavorite } = useFavorites();
  const [activeNav, setActiveNav] = useState('food-order');
  const [activeCategory, setActiveCategory] = useState('all');

  // Get user data from localStorage safely
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

  // Categories
  const categories = [
    { id: 'biryani', name: 'Biryani', image: biryaniCategoryImage },
    { id: 'burger', name: 'Burgers', image: burgerImage },
    { id: 'pizza', name: 'Pizzas', image: pizzaImage },
    { id: 'paratha', name: 'Paratha', image: parathaImage },
    { id: 'cakes', name: 'Cakes', image: cakeImage },
    { id: 'rolls', name: 'Rolls', image: springRollsCategoryImage },
    { id: 'noodles', name: 'Noodles', image: noodlesImage },
    { id: 'chole', name: 'Chole Bhature', image: choleBhatureImage },
  ];

  // Popular dishes
  const popularDishes = [
    { id: 'home-1', name: 'Butter Chicken', price: '₹189', discount: '15% Off', image: butterChickenImage },
    { id: 'home-2', name: 'Sushi Platter', price: '₹259', discount: '10% Off', image: sushiPlatterImage },
    { id: 'home-3', name: 'Spring Rolls', price: '₹149', discount: '20% Off', image: springRollsImage },
    { id: 'home-4', name: 'Manchurian Soup', price: '₹119', discount: '25% Off', image: manchurianSoupImage },
    { id: 'home-5', name: 'Dim Sum', price: '₹289', discount: '25% Off', image: dimSumImage },
    { id: 'home-6', name: 'Peking Duck', price: '₹329', discount: '15% Off', image: pekingDuckImage },
    { id: 'home-7', name: 'Kung Pao',discount: '25% Off', price: '₹179', image: kungPaoImage },
    { id: 'home-8', name: 'Tempura', price: '₹99', discount: 'Buy 2 Get 1', image: tempuraImage },
    { id: 'home-9', name: 'Biryani', price: '₹349', discount: 'Special', image: biryaniImage },
  ];

  // Recent orders
  const recentOrders = [
    { id: 1, name: 'Butter Chicken', time: '10:30 AM', icon: '�', image: butterChickenImage },
    { id: 2, name: 'Sushi Platter', time: 'Yesterday', icon: '🍣', image: sushiPlatterImage },
    { id: 3, name: 'Spring Rolls', time: 'Dec 12', icon: '🥟', image: springRollsImage },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40.00;
  const total = subtotal + deliveryFee;

  // Handlers
  const handleAddToCart = (dish) => {
    const cartItem = {
      id: dish.id || Date.now(),
      name: dish.name,
      price: parseFloat(dish.price.replace('₹', '')),
      icon: dish.icon || '🍽️'
    };
    addToCart(cartItem);
  };

  const handleAddToFavorites = (item) => {
    addToFavorites(item);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleLogout = () => {
    // Clear user data from localStorage safely
    removeStoredItem('user');
    navigate('/login');
  };

  const scrollCategories = (direction) => {
    const grid = document.getElementById('categoriesGrid');
    if (grid) {
      const scrollAmount = 200;
      const startScroll = grid.scrollLeft;
      const targetScroll = direction === 'left' 
        ? Math.max(0, startScroll - scrollAmount)
        : startScroll + scrollAmount;
      
      // Smooth animation
      const duration = 300;
      const startTime = performance.now();
      
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        grid.scrollLeft = startScroll + (targetScroll - startScroll) * easeInOutCubic;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  const scrollDishes = (direction) => {
    const grid = document.getElementById('dishesGrid');
    if (!grid) return;
    
    // Use native smooth scrolling with scroll-snap for better performance
    const cardWidth = 324; // 300px card width + 24px gap
    const scrollAmount = cardWidth;
    const currentScroll = grid.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(grid.scrollWidth - grid.clientWidth, currentScroll + scrollAmount);
    
    // Only scroll if we're not already at the edge
    if (targetScroll !== currentScroll) {
      grid.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
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
              <h3>Welcome back, {userName}!</h3>
              <p>Ready to order delicious food?</p>
            </div>
          </div>
          
          <div className="header-actions">
            <NotificationButton onClick={() => navigate('/notifications')} />
            <ThemeToggle />
          </div>
        </header>

        {/* Discount Banner */}
        <section className="discount-banner">
          <div className="banner-content">
            <h2>Get Up To 20% Discount On Your First Order</h2>
            <p>
              Get the absolute best out of the main dishes that are prepared by the top 1% of chefs 
              around the world. Don't hesitate to get started now!
            </p>
            <button className="order-btn" onClick={() => alert('Order now!')}>
              Order Now
            </button>
          </div>
          <div className="banner-image">🍣</div>
        </section>

        {/* Categories */}
        <section className="categories-section">
          <h2 className="section-title">What&apos;s on your mind?</h2>
          <div className="categories-scroll-container">
            <button className="scroll-arrow left-arrow" onClick={() => scrollCategories('left')}>←</button>
            <div className="categories-grid" id="categoriesGrid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.id);
                  navigate(`/category/${category.id}`);
                }}
              >
                <div className="category-icon">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      style={{width: '50px', height: '50px', objectFit: 'cover'}}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    category.icon
                  )}
                </div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
            </div>
            <button className="scroll-arrow right-arrow" onClick={() => scrollCategories('right')}>→</button>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="content-columns">
          {/* Left Column - Popular Dishes */}
          <div className="left-column">
            <section className="dishes-section">
              <h2 className="section-title">
                Popular Dishes
                <button className="view-all" onClick={() => alert('Viewing all dishes!')}>View all</button>
              </h2>
              <div className="dishes-scroll-container">
                <button className="scroll-arrow left-arrow" onClick={() => scrollDishes('left')}>←</button>
                <div className="dishes-grid" id="dishesGrid">
                  {popularDishes.map((dish) => (
                    <div key={dish.id} className="dish-card">
                      <div className="dish-image">
                        <span className="dish-badge">{dish.discount}</span>
                        <PremiumFavoriteButton item={dish} />
                        {dish.image ? (
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="dish-emoji">{dish.icon}</span>
                        )}
                      </div>
                      <div className="dish-info">
                        <h3 className="dish-name">{dish.name}</h3>
                        <div className="dish-price">{dish.price}</div>
                        <button
                          className="order-btn"
                          style={{ marginTop: '15px', width: '100%' }}
                          onClick={() => handleAddToCart(dish)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="scroll-arrow right-arrow" onClick={() => scrollDishes('right')}>→</button>
              </div>
            </section>

            {/* Order Menu */}
            <section className="order-menu">
              <h2 className="section-title">Order Menu</h2>
              <div className="menu-items">
                {cartItems.map((item) => {
                  // Find corresponding dish image from popularDishes
                  const dish = popularDishes.find(d => d.name === item.name);
                  return (
                    <div key={item.id} className="menu-item">
                      <div className="item-image-container">
                        {dish && dish.image ? (
                          <img
                            src={dish.image}
                            alt={item.name}
                            className="item-image"
                          />
                        ) : (
                          <span className="item-icon">{item.icon}</span>
                        )}
                      </div>
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">X{item.quantity}</span>
                      <span className="item-price">+₹{item.price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="delivery-row">
                <span>Delivery</span>
                <span>+₹{deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="total-row">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </section>

            {/* Checkout Section */}
            <section className="checkout-section">
              <button className="coupon-link" onClick={() => alert('Coupon code functionality coming soon!')}>Get a coupon code?</button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            {/* Top Section - Recent Order and Balance Side by Side */}
            <div className="top-section">
              {/* Recent Orders */}
              <section className="recent-orders">
                <h2 className="section-title">
                  Recent Order
                  <button className="view-all" onClick={() => navigate('/order-history')}>View all</button>
                </h2>
                <div className="orders-list">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-image-container">
                        {order.image ? (
                          <img
                            src={order.image}
                            alt={order.name}
                            className="order-image"
                          />
                        ) : (
                          <div className="order-icon">{order.icon}</div>
                        )}
                      </div>
                      <div className="order-details">
                        <h4>{order.name}</h4>
                        <p>{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Balance Card */}
              <section className="balance-card">
                <h2 className="section-title" style={{color: 'white'}}>Your Balance</h2>
                <div className="balance-amount">₹20.04</div>
                <div className="balance-actions">
                  <button className="balance-btn">
                    <span>💳</span>
                    <span>Transfer</span>
                  </button>
                  <button className="balance-btn">
                    <span>➕</span>
                    <span>Add</span>
                  </button>
                  <button className="balance-btn">
                    <span>₿</span>
                    <span>Crypto</span>
                  </button>
                </div>
              </section>
            </div>

            {/* Address Card */}
            <section className="address-card">
              <div className="address-header">
                <h2 className="section-title">Your Address</h2>
                <button className="change-btn">Change</button>
              </div>
              <h3 style={{marginBottom: '10px', color: 'var(--text-dark)'}}>
                Plot No. 42, Sector 5, CDA Building
              </h3>
              <p className="address-text">
                Saheed Nagar, Bhubaneswar, Odisha 751019, India
              </p>
              <button className="add-details-btn">
                <span>➕</span>
                <span>Add Details</span>
              </button>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="homepage-footer">
          <p> 2026 Onigiri - Delicious Food Delivery</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </footer>
      </main>
      
      {/* Hovering Cart */}
      <HoveringCart />
    </div>
  );
};

export default Homepage;