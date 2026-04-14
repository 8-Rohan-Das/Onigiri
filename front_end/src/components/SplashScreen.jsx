import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/logo.png';

const SplashScreen = ({ message = "Preparing your delicious experience..." }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-overlay">
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <div className="splash-glow"></div>
          <img src={logo} alt="Onigiri Logo" className="splash-logo" />
        </div>
        
        <div className="splash-text-container">
          <h1 className="splash-brand">ONIGIRI</h1>
          <p className="splash-message">
            {message}
            <span className="splash-dots">{dots}</span>
          </p>
        </div>

        <div className="splash-loader-bar">
          <div className="splash-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
