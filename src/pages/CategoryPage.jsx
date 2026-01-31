import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import HoveringCart from '../components/HoveringCart';
import './homepage.css';
import './CategoryPage.css';

// Import images
import logo from '../assets/logo.png';
import biryaniImage from '../assets/vecteezy_ai-generated-delicious-dum-handi-biryani-in-bowl-isolated-on_41856072.png';
import burgerImage from '../assets/icons8-burger-100.png';
import pizzaImage from '../assets/pizza.png';
import parathaImage from '../assets/paratha.png';
import cakeImage from '../assets/cake.png';
import springRollsImage from '../assets/spring-rolls.png';
import noodlesImage from '../assets/noodles.png';
import choleBhatureImage from '../assets/chole-bhature.png';
import butterChickenImage from '../assets/vecteezy_butter-chicken-with_25270174.png';
import sushiPlatterImage from '../assets/vecteezy_sushi-platter-with-different-types-of-sushi_27735645.png';
import manchurianImage from '../assets/vecteezy_chili-soup-in-a-bowl-on-a-transparent-background_57754847.png';
import dimSumImage from '../assets/vecteezy_ai-generated-steamed-stuff-custard-bun-in-bamboo-basket-png_35675661.png';
import kungPaoImage from '../assets/vecteezy_spicy-kung-pao-chicken-a-fiery-sichuan-favorite-with_47072686.png';
import tempuraImage from '../assets/vecteezy_golden-fried-shrimp-tempura-on-white-plate_50278149.png';
import pekingDuckImage from '../assets/vecteezy_peking-duck-png-with-ai-generated_26758795.png';

// Import navigation images
import restaurantImage from '../assets/restaurant.png';
import heartImage from '../assets/heart.png';
import emailImage from '../assets/email.png';
import orderHistoryImage from '../assets/order-history.png';
import otherImage from '../assets/other.png';
import userImage from '../assets/user.png';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('food-order');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
  const { addToCart } = useCart();
  
  // Get user data
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

  // Category configurations
  const categoryConfig = {
    biryani: {
      title: 'Biryani',
      description: 'Authentic aromatic rice dishes from across India',
      image: biryaniImage,
      subCategories: [
        { id: 'chicken', name: 'Chicken Biryani', count: 24 },
        { id: 'mutton', name: 'Mutton Biryani', count: 18 },
        { id: 'veg', name: 'Vegetarian Biryani', count: 15 },
        { id: 'hyderabadi', name: 'Hyderabadi', count: 12 },
        { id: 'lucknowi', name: 'Lucknowi', count: 8 }
      ]
    },
    burger: {
      title: 'Burgers',
      description: 'Juicy patties and gourmet burger creations',
      image: burgerImage,
      subCategories: [
        { id: 'classic', name: 'Classic Burgers', count: 20 },
        { id: 'cheese', name: 'Cheese Burgers', count: 16 },
        { id: 'veggie', name: 'Veggie Burgers', count: 14 },
        { id: 'chicken', name: 'Chicken Burgers', count: 18 },
        { id: 'gourmet', name: 'Gourmet Special', count: 10 }
      ]
    },
    pizza: {
      title: 'Pizzas',
      description: 'Wood-fired and artisanal pizza varieties',
      image: pizzaImage,
      subCategories: [
        { id: 'margherita', name: 'Margherita', count: 12 },
        { id: 'pepperoni', name: 'Pepperoni', count: 15 },
        { id: 'veggie', name: 'Vegetarian', count: 18 },
        { id: 'meat', name: 'Meat Lovers', count: 14 },
        { id: 'gourmet', name: 'Gourmet', count: 10 }
      ]
    },
    paratha: {
      title: 'Parathas',
      description: 'Flaky Indian flatbreads with various fillings',
      image: parathaImage,
      subCategories: [
        { id: 'aloo', name: 'Aloo Paratha', count: 8 },
        { id: 'paneer', name: 'Paneer Paratha', count: 10 },
        { id: 'gobi', name: 'Gobi Paratha', count: 6 },
        { id: 'mixed', name: 'Mixed Veg', count: 12 },
        { id: 'stuffed', name: 'Stuffed Special', count: 8 }
      ]
    },
    cakes: {
      title: 'Cakes',
      description: 'Decadent desserts and celebration cakes',
      image: cakeImage,
      subCategories: [
        { id: 'chocolate', name: 'Chocolate', count: 25 },
        { id: 'vanilla', name: 'Vanilla', count: 18 },
        { id: 'fruit', name: 'Fruit Cakes', count: 15 },
        { id: 'cheesecake', name: 'Cheesecakes', count: 12 },
        { id: 'pastries', name: 'Pastries', count: 20 }
      ]
    },
    rolls: {
      title: 'Rolls',
      description: 'Wraps and rolls from around the world',
      image: springRollsImage,
      subCategories: [
        { id: 'spring', name: 'Spring Rolls', count: 14 },
        { id: 'kathi', name: 'Kathi Rolls', count: 16 },
        { id: 'wraps', name: 'Wraps', count: 12 },
        { id: 'sushi', name: 'Sushi Rolls', count: 20 },
        { id: 'egg', name: 'Egg Rolls', count: 10 }
      ]
    },
    noodles: {
      title: 'Noodles',
      description: 'Asian noodle dishes and pasta varieties',
      image: noodlesImage,
      subCategories: [
        { id: 'hakka', name: 'Hakka Noodles', count: 15 },
        { id: 'singapore', name: 'Singapore Noodles', count: 10 },
        { id: 'pasta', name: 'Pasta', count: 18 },
        { id: 'ramen', name: 'Ramen', count: 22 },
        { id: 'udon', name: 'Udon Noodles', count: 8 }
      ]
    },
    chole: {
      title: 'Chole Bhature',
      description: 'North Indian chickpea curry with fluffy bread',
      image: choleBhatureImage,
      subCategories: [
        { id: 'classic', name: 'Classic Chole', count: 8 },
        { id: 'amritsari', name: 'Amritsari', count: 6 },
        { id: 'dry', name: 'Dry Chole', count: 5 },
        { id: 'bhature', name: 'Bhature Varieties', count: 10 },
        { id: 'combo', name: 'Combos', count: 12 }
      ]
    }
  };

  // Dynamic menu items based on category
  const generateMenuItems = (categoryType) => {
    const baseItems = {
      biryani: [
        { id: 'biryani-1', name: 'Hyderabadi Chicken Biryani', price: '₹349', discount: '20% Off', image: biryaniImage, rating: 4.8, time: '30 min' },
        { id: 'biryani-2', name: 'Lucknowi Mutton Biryani', price: '₹429', discount: '15% Off', image: biryaniImage, rating: 4.7, time: '35 min' },
        { id: 'biryani-3', name: 'Veg Dum Biryani', price: '₹289', discount: '10% Off', image: biryaniImage, rating: 4.6, time: '25 min' },
        { id: 'biryani-4', name: 'Kolkata Biryani', price: '₹319', discount: 'Special', image: biryaniImage, rating: 4.5, time: '30 min' },
        { id: 'biryani-5', name: 'Andhra Biryani', price: '₹299', discount: 'Buy 1 Get 1', image: biryaniImage, rating: 4.7, time: '28 min' },
        { id: 'biryani-6', name: 'Malabar Biryani', price: '₹379', discount: '12% Off', image: biryaniImage, rating: 4.6, time: '32 min' }
      ],
      burger: [
        { id: 'burger-1', name: 'Classic Beef Burger', price: '₹189', discount: '15% Off', image: burgerImage, rating: 4.5, time: '15 min' },
        { id: 'burger-2', name: 'Cheese Burst Burger', price: '₹229', discount: '20% Off', image: burgerImage, rating: 4.7, time: '18 min' },
        { id: 'burger-3', name: 'Veggie Delight Burger', price: '₹159', discount: '10% Off', image: burgerImage, rating: 4.4, time: '12 min' },
        { id: 'burger-4', name: 'Chicken BBQ Burger', price: '₹249', discount: 'Special', image: burgerImage, rating: 4.8, time: '20 min' },
        { id: 'burger-5', name: 'Mushroom Swiss Burger', price: '₹199', discount: 'Buy 2 Get 1', image: burgerImage, rating: 4.6, time: '16 min' },
        { id: 'burger-6', name: 'Spicy Paneer Burger', price: '₹179', discount: '12% Off', image: burgerImage, rating: 4.5, time: '14 min' }
      ],
      pizza: [
        { id: 'pizza-1', name: 'Margherita Pizza', price: '₹249', discount: '15% Off', image: pizzaImage, rating: 4.6, time: '20 min' },
        { id: 'pizza-2', name: 'Pepperoni Feast', price: '₹329', discount: '20% Off', image: pizzaImage, rating: 4.8, time: '25 min' },
        { id: 'pizza-3', name: 'Veggie Supreme', price: '₹289', discount: '10% Off', image: pizzaImage, rating: 4.5, time: '22 min' },
        { id: 'pizza-4', name: 'BBQ Chicken Pizza', price: '₹359', discount: 'Special', image: pizzaImage, rating: 4.7, time: '28 min' },
        { id: 'pizza-5', name: 'Four Cheese Pizza', price: '₹299', discount: 'Buy 1 Get 1', image: pizzaImage, rating: 4.6, time: '24 min' },
        { id: 'pizza-6', name: 'Tandoori Paneer Pizza', price: '₹319', discount: '12% Off', image: pizzaImage, rating: 4.5, time: '26 min' }
      ]
    };

    // Default items for other categories
    const defaultItems = [
      { id: `${categoryType}-1`, name: `Classic ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹199', discount: '15% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.5, time: '20 min' },
      { id: `${categoryType}-2`, name: `Special ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹249', discount: '20% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.7, time: '25 min' },
      { id: `${categoryType}-3`, name: `Deluxe ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹299', discount: '10% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.6, time: '22 min' }
    ];

    return baseItems[categoryType] || defaultItems;
  };

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    setMenuItems(generateMenuItems(category));
  }, [category]);

  const currentCategory = categoryConfig[category] || {
    title: 'Category',
    description: 'Explore delicious options',
    image: burgerImage,
    subCategories: []
  };

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.replace('₹', '')),
      icon: item.image ? '🍽️' : '🍱'
    };
    addToCart(cartItem);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    // Filter items based on sub-category (you can implement this logic)
  };

  const handleLogout = () => {
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
              <h3>Exploring {currentCategory.title}, {userName}!</h3>
              <p>{currentCategory.description}</p>
            </div>
          </div>
        </header>

        {/* Category Hero Section */}
        <section className="category-hero">
          <div className="hero-content">
            <div className="hero-image">
              <img src={currentCategory.image} alt={currentCategory.title} style={{width: '120px', height: '120px', objectFit: 'cover'}} />
            </div>
            <div className="hero-text">
              <h1>{currentCategory.title}</h1>
              <p>{currentCategory.description}</p>
              <div className="category-stats">
                <span>{currentCategory.subCategories.reduce((acc, cat) => acc + cat.count, 0)}+ Options</span>
                <span>•</span>
                <span>Starting from ₹149</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-categories */}
        <section className="subcategories-section">
          <h2 className="section-title">Explore by Type</h2>
          <div className="subcategories-grid">
            {currentCategory.subCategories.map((subCat) => (
              <div
                key={subCat.id}
                className={`subcategory-card ${selectedSubCategory === subCat.id ? 'active' : ''}`}
                onClick={() => handleSubCategoryClick(subCat.id)}
              >
                <h3>{subCat.name}</h3>
                <span>{subCat.count} items</span>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Items */}
        <section className="menu-items-section">
          <div className="section-header">
            <h2 className="section-title">Popular {currentCategory.title}</h2>
            <div className="filter-options">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Vegetarian</button>
              <button className="filter-btn">Non-Veg</button>
              <button className="filter-btn">Bestseller</button>
            </div>
          </div>
          
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-image">
                  {item.discount && <span className="discount-badge">{item.discount}</span>}
                  <img src={item.image} alt={item.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                </div>
                <div className="menu-item-content">
                  <h3>{item.name}</h3>
                  <div className="menu-item-meta">
                    <span className="rating">⭐ {item.rating}</span>
                    <span className="time">⏱️ {item.time}</span>
                  </div>
                  <div className="menu-item-footer">
                    <span className="price">{item.price}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="recommendations-section">
          <h2 className="section-title">You Might Also Like</h2>
          <div className="recommendations-grid">
            <div className="recommendation-card">
              <img src={butterChickenImage} alt="Butter Chicken" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
              <div>
                <h4>Butter Chicken</h4>
                <p>₹189 • 4.8⭐</p>
              </div>
            </div>
            <div className="recommendation-card">
              <img src={sushiPlatterImage} alt="Sushi" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
              <div>
                <h4>Sushi Platter</h4>
                <p>₹259 • 4.7⭐</p>
              </div>
            </div>
            <div className="recommendation-card">
              <img src={manchurianImage} alt="Manchurian" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
              <div>
                <h4>Manchurian</h4>
                <p>₹119 • 4.6⭐</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HoveringCart />
    </div>
  );
};

export default CategoryPage;
