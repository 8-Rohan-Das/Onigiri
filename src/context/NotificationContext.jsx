import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storageUtils.js';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // Load notifications from localStorage on mount (lazy initialization)
  // Load notifications from localStorage on mount (lazy initialization)
  const [notifications, setNotifications] = useState(() => {
    return getStoredItem('notifications', []);
  });

  // Derived state (no need for useState + useEffect)
  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    setStoredItem('notifications', notifications);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  // Real-time notification generators
  const notifyOrderPlaced = (orderDetails) => {
    addNotification({
      type: 'order',
      title: 'Order Placed Successfully!',
      message: `Your order #${orderDetails.orderId} has been placed and will be delivered soon.`,
      icon: '📦',
      action: '/order-history'
    });
  };

  const notifyOrderStatusUpdate = (orderId, status) => {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed!',
      'preparing': 'Your order is being prepared!',
      'out_for_delivery': 'Your order is out for delivery!',
      'delivered': 'Your order has been delivered!',
      'cancelled': 'Your order has been cancelled.'
    };

    addNotification({
      type: 'order',
      title: `Order Update: ${status.replace('_', ' ').toUpperCase()}`,
      message: statusMessages[status] || `Your order #${orderId} status has been updated to ${status}.`,
      icon: status === 'delivered' ? '✅' : status === 'cancelled' ? '❌' : '🚚',
      action: '/order-history'
    });
  };

  const notifySettingsChanged = (setting, value) => {
    addNotification({
      type: 'settings',
      title: 'Settings Updated',
      message: `Your ${setting} settings have been updated.`,
      icon: '⚙️',
      action: '/others'
    });
  };

  const notifyPaymentMethodAdded = (methodType) => {
    addNotification({
      type: 'payment',
      title: 'Payment Method Added',
      message: `New ${methodType} payment method has been added successfully.`,
      icon: '💳',
      action: '/others'
    });
  };

  const notifyAddressAdded = (addressType) => {
    addNotification({
      type: 'address',
      title: 'Address Added',
      message: `New ${addressType} address has been added successfully.`,
      icon: '📍',
      action: '/others'
    });
  };

  const notifyFavoriteAdded = (itemName) => {
    addNotification({
      type: 'favorite',
      title: 'Added to Favorites',
      message: `${itemName} has been added to your favorites.`,
      icon: '❤️',
      action: '/favorite'
    });
  };

  const notifyPromotionalOffer = (offer) => {
    addNotification({
      type: 'promotion',
      title: 'Special Offer! 🎉',
      message: offer.message,
      icon: '🎉',
      action: '/home'
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    notifyOrderPlaced,
    notifyOrderStatusUpdate,
    notifySettingsChanged,
    notifyPaymentMethodAdded,
    notifyAddressAdded,
    notifyFavoriteAdded,
    notifyPromotionalOffer
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
