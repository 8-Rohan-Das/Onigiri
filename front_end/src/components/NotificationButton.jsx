import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import notificationImage from '../assets/notification.png';

const NotificationButton = ({ onClick, style = {} }) => {
  const { unreadCount } = useNotifications();

  const defaultStyle = {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ...style
  };

  return (
    <button 
      className="notification-btn" 
      onClick={onClick}
      style={defaultStyle}
    >
      <img 
        src={notificationImage} 
        alt="Notifications" 
        className="notification-icon"
        style={{ 
          width: '30px', 
          height: '30px', 
          objectFit: 'cover' 
        }} 
      />
      {unreadCount > 0 && (
        <span 
          className="notification-badge"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
