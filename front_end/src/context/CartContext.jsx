import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserStoredItem, setUserStoredItem } from '../utils/storageUtils.js';
import { useNotifications } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [cartItems, setCartItems] = useState(() => {
    const defaultItems = [
      // Default items for demo
      { id: 'def-1', name: 'Vegan Pizza Dough', quantity: 1, price: 120.00, icon: '🍕' },
      { id: 'def-2', name: 'Pepperoni Pizza', quantity: 1, price: 180.00, icon: '🍕' },
      { id: 'def-3', name: 'Fish Burger & Vege', quantity: 1, price: 150.00, icon: '🍔' },
    ];
    return getUserStoredItem('cartItems', defaultItems);
  });

  useEffect(() => {
    setUserStoredItem('cartItems', cartItems);
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = (orderDetails) => {
    const orderId = 'ORD' + Date.now();
    const total = getCartTotal();
    
    // Add order placed notification
    addNotification({
      type: 'order',
      title: 'Order Placed Successfully!',
      message: `Your order #${orderId} for ₹${total.toFixed(2)} has been placed and will be delivered soon.`,
      icon: '📦',
      action: '/order-history'
    });

    // Simulate order status updates
    setTimeout(() => {
      addNotification({
        type: 'order',
        title: 'Order Confirmed',
        message: `Your order #${orderId} has been confirmed by the restaurant.`,
        icon: '✅',
        action: '/order-history'
      });
    }, 2000);

    setTimeout(() => {
      addNotification({
        type: 'order',
        title: 'Order Out for Delivery',
        message: `Your order #${orderId} is on the way and will arrive soon.`,
        icon: '🚚',
        action: '/order-history'
      });
    }, 10000);

    // Clear cart after checkout
    setCartItems([]);
    
    return { orderId, total };
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
