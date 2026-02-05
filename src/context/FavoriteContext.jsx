import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [favoriteItems, setFavoriteItems] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('favoriteItems');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (e) {
      console.error('Failed to load favorites', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favoriteItems]);

  const addToFavorites = (item) => {
    // Check if item is already in favorites
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

    setFavoriteItems(prev => [...prev, { ...item, id: `fav-${item.id}` }]);
    
    addNotification({
      type: 'favorite',
      title: 'Added to Favorites',
      message: `${item.name} has been added to your favorites.`,
      icon: '❤️',
      action: '/favorite'
    });
  };

  const removeFromFavorites = (id) => {
    const item = favoriteItems.find(item => item.id === id);
    setFavoriteItems(prev => prev.filter(item => item.id !== id));
    
    if (item) {
      addNotification({
        type: 'favorite',
        title: 'Removed from Favorites',
        message: `${item.name} has been removed from your favorites.`,
        icon: '💔',
        action: '/favorite'
      });
    }
  };

  const isFavorite = (id) => {
    return favoriteItems.some(fav => fav.id === `fav-${id}` || fav.id === id);
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
