import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserStoredItem, setUserStoredItem, getStoredUser } from '../utils/storageUtils.js';
import { useNotifications } from './NotificationContext';

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const stored = getUserStoredItem('favorites', []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    setUserStoredItem('favorites', favoriteItems);
  }, [favoriteItems]);

  const addToFavorites = (item) => {
    const itemId = item._id || item.id;
    const existing = favoriteItems.find(fav => (fav._id || fav.id) === itemId);
    if (existing) {
      addNotification({
        type: 'favorite',
        title: 'Already in Favorites',
        message: `${item.name} is already in your favorites.`,
        icon: '❤️',
        action: '/favorite'
      });
      return;
    }

    setFavoriteItems(prev => [...prev, { ...item }]);
    
    addNotification({
      type: 'favorite',
      title: 'Added to Favorites',
      message: `${item.name} has been added to your favorites.`,
      icon: '❤️',
      action: '/favorite'
    });
  };

  const removeFromFavorites = (item) => {
    // Handle both item object and ID for flexibility
    const itemId = typeof item === 'object' ? (item._id || item.id) : item;
    
    setFavoriteItems(prev => prev.filter(fav => (fav._id || fav.id) !== itemId));
    
    const removedItem = favoriteItems.find(fav => (fav._id || fav.id) === itemId);
    if (removedItem) {
      addNotification({
        type: 'favorite',
        title: 'Removed from Favorites',
        message: `${removedItem.name} has been removed from your favorites.`,
        icon: '💔',
        action: '/favorite'
      });
    }
  };

  const isFavorite = (id) => {
    return favoriteItems.some(fav => (fav._id || fav.id) === id);
  };

  const getFavorites = () => {
    return favoriteItems;
  };

  return (
    <FavoriteContext.Provider value={{
      favoriteItems,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      getFavorites
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};
