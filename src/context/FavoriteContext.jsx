import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem } from '../utils/storageUtils.js';
import { useNotifications } from './NotificationContext';

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const stored = getStoredItem('favorites', []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    setStoredItem('favorites', favoriteItems);
  }, [favoriteItems]);

  const addToFavorites = (item) => {
    // Check if item is already in favorites using consistent ID comparison
    const existing = favoriteItems.find(fav => fav.id === item.id);
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
    const itemId = typeof item === 'object' ? item.id : item;
    
    setFavoriteItems(prev => prev.filter(fav => fav.id !== itemId));
    
    const removedItem = favoriteItems.find(fav => fav.id === itemId);
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
    return favoriteItems.some(fav => fav.id === id);
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
