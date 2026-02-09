import React from 'react';
import { useFavorites } from '../context/FavoriteContext';
import favouriteIcon from '../assets/favourite.svg';
import favouriteOutlineIcon from '../assets/favourite-outline.svg';
import './FavoriteButton.css';

const FavoriteButton = ({ item, size = 'normal', className = '' }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const isFavorited = isFavorite(item.id);
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    
    if (isFavorited) {
      removeFromFavorites(item);
    } else {
      addToFavorites(item);
    }
  };
  
  const buttonClass = [
    'favorite-btn',
    size === 'small' ? 'small' : '',
    isFavorited ? 'active' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={buttonClass}
      onClick={handleToggleFavorite}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <img
        src={isFavorited ? favouriteIcon : favouriteOutlineIcon}
        alt={isFavorited ? 'Favorited' : 'Not favorited'}
        className="favorite-icon"
      />
    </button>
  );
};

export default FavoriteButton;
