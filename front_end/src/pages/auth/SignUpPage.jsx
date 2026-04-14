import React, { useState, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useSignUp } from '../../hooks/useSignUp';
import SplashScreen from '../../components/SplashScreen';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    passwordStrength,
    error,
    isLoading,
    handleChange,
    handleSubmit 
  } = useSignUp();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) {
      setShowSplash(true);
      setTimeout(() => {
        navigate('/home');
      }, 2500);
    }
  };

  // Force light mode on auth pages — useLayoutEffect runs before paint (no flash)
  useLayoutEffect(() => {
    document.body.classList.remove('dark-mode');
    return () => {
      // Restore dark mode on leave only if user's saved preference is dark
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
      }
    };
  }, []);

  if (showSplash) {
    return <SplashScreen message="Preparing your personalized flavors..." />;
  }

  return (
    <div className="login-wrapper">
      {/* Left Section */}
      <div className="welcome-section">
        {/* Logo Container */}
        <div className="logo-container">
          <img src={logo} alt="Onigiri Logo" className="logo-image" />
          <div className="logo-text">
            <div className="brand-name">ONIGIRI</div>
            <div className="brand-slogan">Hunger has met its match</div>
          </div>
        </div>
        
        <div className="top-nav">
          <div className="top-action-buttons">
            <Link to="/login" className="top-action-btn">Login</Link>
            <Link to="/signup" className="top-action-btn active">Sign Up</Link>
          </div>
        </div>
        
        <div className="welcome-text">
          <h1>Join Onigiri!</h1>
          <p>Create your account and start ordering delicious food</p>
        </div>
        
        {/* Matrix-style Food Emoji Rain */}
        <div className="food-images">
          <div className="matrix-bg"></div>
          <div className="matrix-rain">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="matrix-column" key={i}>
                <span className="matrix-emoji">🍕</span>
                <span className="matrix-emoji">🍔</span>
                <span className="matrix-emoji">🌮</span>
                <span className="matrix-emoji">🍜</span>
                <span className="matrix-emoji">🥗</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-section">
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <h2 className="title" style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Sign Up</h2>
          <p className="subtitle" style={{ textAlign: 'center' }}>Create your account to get started</p>
          
          <form onSubmit={handleFormSubmit}>
            {error && (
              <div style={{ 
                backgroundColor: '#fee', 
                color: '#c00', 
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid #fcc'
              }}>
                {error}
              </div>
            )}
            
            <div className="floating-label-group">
              <input
                type="text"
                id="name"
                className="input-custom"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
                disabled={isLoading}
              />
              <label htmlFor="name">Full Name</label>
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>
            
            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                className="input-custom"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
                disabled={isLoading}
              />
              <label htmlFor="email">Email Address</label>
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
            </div>
            
            <div className="floating-label-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-custom"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  disabled={isLoading}
                />
                <label htmlFor="password">Create Password</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              
              {formData.password && (
                <div className="strength-indicator">
                  <div className="strength-bar-container">
                    <div className="strength-bar" style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      backgroundColor: passwordStrength.strength === 'Weak' ? '#ff4444' : 
                                      passwordStrength.strength === 'Medium' ? '#ffaa00' : '#00c851'
                    }}></div>
                  </div>
                  <div className="strength-info">
                    <span className="strength-label" style={{
                      color: passwordStrength.strength === 'Weak' ? '#ff4444' : 
                             passwordStrength.strength === 'Medium' ? '#ffaa00' : '#00c851'
                    }}>{passwordStrength.strength}</span>
                    {passwordStrength.feedback && <span className="strength-feedback">{passwordStrength.feedback}</span>}
                  </div>
                </div>
              )}
            </div>
            
            <div className="floating-label-group">
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="input-custom"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  disabled={isLoading}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className={`field-validation ${formData.password === formData.confirmPassword ? 'success' : 'error'}`}>
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                I agree to the Terms & Conditions
              </label>
            </div>
            
            <button type="submit" className="btn-login" disabled={isLoading || !formData.agreeTerms}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <div className="social-login">
            <button className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' }}>
            Already have an account? <Link to="/login" className="signup">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
