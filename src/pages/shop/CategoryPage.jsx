import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';
import HoveringCart from '../../components/HoveringCart';
import '../home/homepage.css';
import './CategoryPage.css';

// Import images
import logo from '../../assets/logo.png';
import biryaniImage from '../../assets/vecteezy_ai-generated-delicious-dum-handi-biryani-in-bowl-isolated-on_41856072.png';
import burgerImage from '../../assets/icons8-burger-100.png';
import pizzaImage from '../../assets/pizza.png';
import parathaImage from '../../assets/paratha.png';
import cakeImage from '../../assets/cake.png';
import springRollsImage from '../../assets/spring-rolls.png';
import noodlesImage from '../../assets/noodles.png';
import choleBhatureImage from '../../assets/chole-bhature.png';
import butterChickenImage from '../../assets/vecteezy_butter-chicken-with_25270174.png';
import sushiPlatterImage from '../../assets/vecteezy_sushi-platter-with-different-types-of-sushi_27735645.png';
import manchurianImage from '../../assets/vecteezy_chili-soup-in-a-bowl-on-a-transparent-background_57754847.png';

// Import navigation images
import restaurantImage from '../../assets/restaurant.png';
import heartImage from '../../assets/heart.png';
import favouriteIcon from '../../assets/favourite.svg';
import emailImage from '../../assets/email.png';
import orderHistoryImage from '../../assets/order-history.png';
import otherImage from '../../assets/other.png';
import userImage from '../../assets/user.png';

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

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('food-order');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite } = useFavorites();
  
  // Get user data
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



  // Dynamic menu items based on category
  const generateMenuItems = useCallback((categoryType) => {
    const baseItems = {
biryani: [
  { 
    id: 'biryani-1', 
    name: 'Hyderabadi Chicken Biryani', 
    price: '₹349', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80", 
    rating: 4.8, 
    time: '30 min' 
  },
  { 
    id: 'biryani-2', 
    name: 'Lucknowi Mutton Biryani', 
    price: '₹429', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80", 
    rating: 4.7, 
    time: '35 min' 
  },
  { 
    id: 'biryani-3', 
    name: 'Veg Dum Biryani', 
    price: '₹289', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&q=80", 
    rating: 4.6, 
    time: '25 min' 
  },
  { 
    id: 'biryani-4', 
    name: 'Kolkata Biryani', 
    price: '₹319', 
    discount: 'Special', 
    image: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=800&q=80", 
    rating: 4.5, 
    time: '30 min' 
  },
  { 
    id: 'biryani-5', 
    name: 'Andhra Biryani', 
    price: '₹299', 
    discount: 'Buy 1 Get 1', 
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80", 
    rating: 4.7, 
    time: '28 min' 
  },
  { 
    id: 'biryani-6', 
    name: 'Malabar Biryani', 
    price: '₹379', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80", 
    rating: 4.6, 
    time: '32 min' 
  }
],
burger: [
  { 
    id: 'burger-1', 
    name: 'Classic Beef Burger', 
    price: '₹189', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", 
    rating: 4.5, 
    time: '15 min' 
  },
  { 
    id: 'burger-2', 
    name: 'Cheese Burst Burger', 
    price: '₹229', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80", 
    rating: 4.7, 
    time: '18 min' 
  },
  { 
    id: 'burger-3', 
    name: 'Veggie Delight Burger', 
    price: '₹159', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80", 
    rating: 4.4, 
    time: '12 min' 
  },
  { 
    id: 'burger-4', 
    name: 'Chicken BBQ Burger', 
    price: '₹249', 
    discount: 'Special', 
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80", 
    rating: 4.8, 
    time: '20 min' 
  },
  { 
    id: 'burger-5', 
    name: 'Mushroom Swiss Burger', 
    price: '₹199', 
    discount: 'Buy 2 Get 1', 
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80", 
    rating: 4.6, 
    time: '16 min' 
  },
  { 
    id: 'burger-6', 
    name: 'Spicy Paneer Burger', 
    price: '₹179', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80", 
    rating: 4.5, 
    time: '14 min' 
  }
] ,
      pizza: [
  { 
    id: 'pizza-1', 
    name: 'Margherita Pizza', 
    price: '₹249', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80", 
    rating: 4.6, 
    time: '20 min' 
  },
  { 
    id: 'pizza-2', 
    name: 'Pepperoni Feast', 
    price: '₹329', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80", 
    rating: 4.8, 
    time: '25 min' 
  },
  { 
    id: 'pizza-3', 
    name: 'Veggie Supreme', 
    price: '₹289', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800&q=80", 
    rating: 4.5, 
    time: '22 min' 
  },
  { 
    id: 'pizza-4', 
    name: 'BBQ Chicken Pizza', 
    price: '₹359', 
    discount: 'Special', 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", 
    rating: 4.7, 
    time: '28 min' 
  },
  { 
    id: 'pizza-5', 
    name: 'Four Cheese Pizza', 
    price: '₹299', 
    discount: 'Buy 1 Get 1', 
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", 
    rating: 4.6, 
    time: '24 min' 
  },
  { 
    id: 'pizza-6', 
    name: 'Tandoori Paneer Pizza', 
    price: '₹319', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80", 
    rating: 4.5, 
    time: '26 min' 
  }
],
  paratha: [
  { 
    id: 'paratha-1', 
    name: 'Aloo Paratha', 
    price: '₹89', 
    discount: '15% Off', 
    image: "https://media.istockphoto.com/id/1285918893/photo/pilaf-is-a-traditional-rice-dish-with-lamb-or-beef-and-vegetables-and-hot-pie-in-ethnic-uzbek.webp?a=1&b=1&s=612x612&w=0&k=20&c=zyEWkMv66MZmV9u-qVbtStNU9JPNvuSMWtIUyYepMng=", 
    rating: 4.7, 
    time: '15 min' 
  },
  { 
    id: 'paratha-2', 
    name: 'Lachha Paratha', 
    price: '₹109', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1678781283125-de3eb701167b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D", 
    rating: 4.8, 
    time: '18 min' 
  },
  { 
    id: 'paratha-3', 
    name: 'Gobi Paratha', 
    price: '₹79', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1683533746199-9e3920bf3eab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D", 
    rating: 4.5, 
    time: '12 min' 
  },
  { 
    id: 'paratha-4', 
    name: 'Methi Paratha', 
    price: '₹89', 
    discount: 'Special', 
    image: "https://media.istockphoto.com/id/1412225317/photo/delicious-fried-chebureki-with-vegetables-served-on-black-table-flat-lay-space-for-text.webp?a=1&b=1&s=612x612&w=0&k=20&c=MyYNEO-I83Qq_RI8RBHpXTqGQCzHXHU71Ngsdv2CBzM=", 
    rating: 4.6, 
    time: '15 min' 
  },
  { 
    id: 'paratha-5', 
    name: 'Panner Paratha', 
    price: '₹69', 
    discount: 'Buy 2 Get 1', 
    image: "https://media.istockphoto.com/id/1500009883/photo/top-view-of-butter-paratha-served-with-pickle-and-dahi-in-plate.webp?a=1&b=1&s=612x612&w=0&k=20&c=E_89c6EzGVN7akHXl1jVs_vCYFgmwBEojuRF58cL6-E=", 
    rating: 4.4, 
    time: '10 min' 
  },
  { 
    id: 'paratha-6', 
    name: 'Mixed Paratha', 
    price: '₹119', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1683533743190-89c9b19f9ea6?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    rating: 4.7, 
    time: '20 min' 
  }
],
    cakes: [
  { 
    id: 'cake-1', 
    name: 'Chocolate Truffle Cake', 
    price: '₹349', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80", 
    rating: 4.9, 
    time: '25 min' 
  },
  { 
    id: 'cake-2', 
    name: 'Black Forest Cake', 
    price: '₹399', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", 
    rating: 4.8, 
    time: '30 min' 
  },
  { 
    id: 'cake-3', 
    name: 'Red Velvet Cake', 
    price: '₹429', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80", 
    rating: 4.7, 
    time: '28 min' 
  },
  { 
    id: 'cake-4', 
    name: 'Vanilla Sponge Cake', 
    price: '₹299', 
    discount: 'Special', 
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80", 
    rating: 4.5, 
    time: '20 min' 
  },
  { 
    id: 'cake-5', 
    name: 'Butterscotch Cake', 
    price: '₹379', 
    discount: 'Buy 1 Get 1', 
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80", 
    rating: 4.6, 
    time: '25 min' 
  },
  { 
    id: 'cake-6', 
    name: 'Fruit Cake', 
    price: '₹329', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80", 
    rating: 4.4, 
    time: '22 min' 
  }
],
    rolls: [
  { 
    id: 'roll-1', 
    name: 'Spring Rolls', 
    price: '₹149', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1695712641569-05eee7b37b6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3ByaW5nJTIwcm9sbHN8ZW58MHx8MHx8fDA%3D", 
    rating: 4.6, 
    time: '15 min' 
  },
  { 
    id: 'roll-2', 
    name: 'Paneer Roll', 
    price: '₹179', 
    discount: '20% Off', 
    image: "https://media.istockphoto.com/id/1392580472/photo/potato-fries-kathi-roll.webp?a=1&b=1&s=612x612&w=0&k=20&c=QWfMElD51QSk8S3y-27OEDPd0vOmobS3-GQDaOaU9UE=", 
    rating: 4.7, 
    time: '18 min' 
  },
  { 
    id: 'roll-3', 
    name: 'Chicken Roll', 
    price: '₹199', 
    discount: '10% Off', 
    image: "https://static.vecteezy.com/system/resources/thumbnails/052/824/999/small/chicken-shawarma-plated-on-a-rustic-wooden-board-free-photo.jpg", 
    rating: 4.8, 
    time: '20 min' 
  },
  { 
    id: 'roll-4', 
    name: 'Veggie Roll', 
    price: '₹139', 
    discount: 'Special', 
    image: "https://www.shutterstock.com/image-photo/selective-focus-indian-food-paneer-260nw-2441817529.jpg", 
    rating: 4.5, 
    time: '12 min' 
  },
  { 
    id: 'roll-5', 
    name: 'Egg Roll', 
    price: '₹169', 
    discount: 'Buy 2 Get 1', 
    image: "https://www.bigbasket.com/media/uploads/recipe/w-l/3684_1_1.jpg", 
    rating: 4.6, 
    time: '15 min' 
  },
  { 
    id: 'roll-6', 
    name: 'Schezwan Roll', 
    price: '₹189', 
    discount: '12% Off', 
    image: "https://c.ndtvimg.com/2023-06/ni1lt8k_spring-roll_625x300_21_June_23.jpg", 
    rating: 4.7, 
    time: '18 min' 
  }
],
  noodles: [
  { 
    id: 'noodle-1', 
    name: 'Hakka Noodles', 
    price: '₹159', 
    discount: '15% Off', 
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80", 
    rating: 4.6, 
    time: '15 min' 
  },
  { 
    id: 'noodle-2', 
    name: 'Schezwan Noodles', 
    price: '₹179', 
    discount: '20% Off', 
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80", 
    rating: 4.7, 
    time: '18 min' 
  },
  { 
    id: 'noodle-3', 
    name: 'Veg Chowmein', 
    price: '₹149', 
    discount: '10% Off', 
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80", 
    rating: 4.5, 
    time: '12 min' 
  },
  { 
    id: 'noodle-4', 
    name: 'Chicken Noodles', 
    price: '₹199', 
    discount: 'Special', 
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80", 
    rating: 4.8, 
    time: '20 min' 
  },
  { 
    id: 'noodle-5', 
    name: 'Paneer Noodles', 
    price: '₹189', 
    discount: 'Buy 2 Get 1', 
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80", 
    rating: 4.6, 
    time: '18 min' 
  },
  { 
    id: 'noodle-6', 
    name: 'Thai Noodles', 
    price: '₹219', 
    discount: '12% Off', 
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&q=80", 
    rating: 4.7, 
    time: '22 min' 
  }
],
    chole: [
  { 
    id: 'chole-1', 
    name: 'Chole Bhature', 
    price: '₹189', 
    discount: '15% Off', 
    image: "https://media.istockphoto.com/id/1226874899/photo/maharashtrian-spicy-cuisine-malvani-special-dish-kombadi-wade-chicken-wade.jpg?s=612x612&w=0&k=20&c=zQFAKSmlpYHO9pWsO58Fj8TsGvbL51rR24a9Mw02jrI=", 
    rating: 4.8, 
    time: '20 min' 
  },
  { 
    id: 'chole-2', 
    name: 'Chole Kulche', 
    price: '₹169', 
    discount: '20% Off', 
    image: "https://media.istockphoto.com/id/1321061421/photo/chickpeas-masala-and-bhatura-or-puri-garnished-with-fresh-green-coriander-and-ingredients.jpg?s=612x612&w=0&k=20&c=FY_TzxHvNu-JsHlfq58w_P2Wspo9N-F5F1-ulLw58Do=", 
    rating: 4.7, 
    time: '18 min' 
  },
  { 
    id: 'chole-3', 
    name: 'Chole Rice', 
    price: '₹159', 
    discount: '10% Off', 
    image: "https://media.istockphoto.com/id/1321061416/photo/chickpeas-masala-and-bhatura-or-puri-garnished-with-fresh-green-coriander-and-ingredients.jpg?s=612x612&w=0&k=20&c=CH7Eyy31a2F9BlzkLmvcqLDm6V9qJSdJ37N-gphrx0M=", 
    rating: 4.5, 
    time: '15 min' 
  },
  { 
    id: 'chole-4', 
    name: 'Chole Samosa', 
    price: '₹179', 
    discount: 'Special', 
    image: "https://media.istockphoto.com/id/1310465017/photo/chole-samosa.webp?a=1&b=1&s=612x612&w=0&k=20&c=pBQ4bPJazSe-v7YSchoAVXkKruZLJ9s2S58w52gC87Q=", 
    rating: 4.6, 
    time: '18 min' 
  },
  { 
    id: 'chole-5', 
    name: 'Chole Paratha', 
    price: '₹199', 
    discount: 'Buy 2 Get 1', 
    image: "https://media.istockphoto.com/id/979914742/photo/chole-bhature-or-chick-pea-curry-and-fried-puri-served-in-terracotta-crockery-over-white.jpg?s=612x612&w=0&k=20&c=OLAw-ZleN1UVaa468OlPSAc6dkz2sjehxWevbvZQNew=", 
    rating: 4.7, 
    time: '20 min' 
  },
  { 
    id: 'chole-6', 
    name: 'Chole Puri', 
    price: '₹149', 
    discount: '12% Off', 
    image: "https://media.istockphoto.com/id/2233500907/photo/authentic-north-indian-chole-bhature-meal-traditional-street-food-photography-with-spices.jpg?s=612x612&w=0&k=20&c=3MEupbD4PFxTqZdgnI5clMe0xLPOwpeVOx2xkNbvGNw=", 
    rating: 4.4, 
    time: '15 min' 
  }
]
    };

    // Default items for other categories
    const defaultItems = [
      { id: `${categoryType}-1`, name: `Classic ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹199', discount: '15% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.5, time: '20 min' },
      { id: `${categoryType}-2`, name: `Special ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹249', discount: '20% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.7, time: '25 min' },
      { id: `${categoryType}-3`, name: `Deluxe ${categoryConfig[categoryType]?.title || 'Dish'}`, price: '₹299', discount: '10% Off', image: categoryConfig[categoryType]?.image || burgerImage, rating: 4.6, time: '22 min' }
    ];

    return baseItems[categoryType] || defaultItems;
  }, []);

  const menuItems = useMemo(() => generateMenuItems(category), [category, generateMenuItems]);

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

  const handleAddToFavorites = (item) => {
    addToFavorites(item);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
    // Filter items based on sub-category (you can implement this logic)
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
                    <div className="menu-item-actions">
                      <button 
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(item);
                        }}
                        style={{
                          background: isFavorite(item.id) ? '#ff4444' : 'transparent',
                          border: '1px solid #ff4444',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          marginRight: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img 
                          src={favouriteIcon} 
                          alt="Add to Favorite" 
                          style={{
                            width: '16px',
                            height: '16px',
                            filter: isFavorite(item.id) ? 'brightness(0) invert(1)' : 'none'
                          }}
                        />
                      </button>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
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
