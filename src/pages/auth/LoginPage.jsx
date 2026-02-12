import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useLogin } from '../../hooks/useLogin';
import { useForgotPassword } from '../../hooks/useForgotPassword';

const LoginPage = () => {
  const {
    formData,
    passwordStrength,
    error,
    isLoading,
    showPassword,
    handleChange,
    handleSocialLogin,
    handleSubmit,
    togglePasswordVisibility,
    clearError,
    login,
    setFormData: setLoginData,
    updateMockCredentials
  } = useLogin();

  // Local state for password reset success message
  const [resetSuccessMessage, setResetSuccessMessage] = React.useState('');

  const handleResetSuccess = async (email, newPassword) => {
    // Update login form data with email only, clear password
    setLoginData(prev => ({
      ...prev,
      email,
      password: ''
    }));

    // Update mock credentials so validation passes
    updateMockCredentials(email, newPassword);

    // Show success message
    setResetSuccessMessage('Password reset successfully. Please log in with your new password.');

    // Clear message after 5 seconds
    setTimeout(() => setResetSuccessMessage(''), 5000);
  };

  const {
    isOpen,
    step,
    isLoading: isForgotLoading,
    error: forgotError,
    successMessage,
    formData: forgotData,
    openModal,
    closeModal,
    handleChange: handleForgotChange,
    handleSendOtp,
    handleResetPassword
  } = useForgotPassword({ onResetSuccess: handleResetSuccess });

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
            <Link to="/login" className="top-action-btn active">Login</Link>
            <Link to="/signup" className="top-action-btn">Sign Up</Link>
          </div>
        </div>

        <div className="welcome-text">
          <h1>Welcome Back!</h1>
          <p>Delicious food is just a login away</p>
        </div>

        {/* Matrix-style Food Emoji Rain */}
        <div className="food-images">
          <div className="matrix-bg"></div>
          <div className="matrix-rain">
            <div className="matrix-column">
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🍔</span>
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🍔</span>
              <span className="matrix-emoji">🌮</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🍔</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🍔</span>
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍕</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🍔</span>
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍜</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🍔</span>
              <span className="matrix-emoji">🌮</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍔</span>
            </div>
            <div className="matrix-column">
              <span className="matrix-emoji">🌮</span>
              <span className="matrix-emoji">🍜</span>
              <span className="matrix-emoji">🥗</span>
              <span className="matrix-emoji">🍕</span>
              <span className="matrix-emoji">🍔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-section">
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <h2 className="title" style={{ fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>Login</h2>
          <p className="subtitle" style={{ textAlign: 'center' }}>Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit}>
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

            {resetSuccessMessage && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #c3e6cb'
              }}>
                {resetSuccessMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                className={`input-custom ${error && !formData.email ? 'error' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                onFocus={clearError}
              />
              {error && !formData.email && <span className="error-message">Email is required</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password"></label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`input-custom ${error && !formData.password ? 'error' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  onFocus={clearError}
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {error && !formData.password && <span className="error-message">Password is required</span>}
              {formData.password && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      height: '100%',
                      backgroundColor: passwordStrength.strength === 'Weak' ? '#ff4444' :
                        passwordStrength.strength === 'Medium' ? '#ffaa00' : '#00c851',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{
                    color: passwordStrength.strength === 'Weak' ? '#ff4444' :
                      passwordStrength.strength === 'Medium' ? '#ffaa00' : '#00c851',
                    fontWeight: '500'
                  }}>
                    {passwordStrength.strength}
                  </span>
                  {passwordStrength.feedback && (
                    <span style={{ color: '#666', fontSize: '11px' }}>
                      • {passwordStrength.feedback}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                Keep Me Logged In
              </label>
              <button type="button" className="forgot-btn" onClick={openModal}>Forgot password?</button>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('Google')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' }}>
            Don't have an account? <Link to="/signup" className="signup">Sign up</Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>&times;</button>

            <h2 className="modal-title">
              {step === 1 ? 'Reset Password' : 'Create New Password'}
            </h2>

            {forgotError && <div className="error-message-modal">{forgotError}</div>}
            {successMessage && <div className="success-message-modal">{successMessage}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <p className="modal-subtitle">Enter your email to receive a verification code.</p>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="input-custom"
                    placeholder="Enter your email"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-login" disabled={isForgotLoading}>
                  {isForgotLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <p className="modal-subtitle">Enter the OTP sent to your email and your new password.</p>
                <div className="form-group">
                  <input
                    type="text"
                    name="otp"
                    className="input-custom"
                    placeholder="Enter 6-digit OTP"
                    value={forgotData.otp}
                    onChange={handleForgotChange}
                    required
                    maxLength="6"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="newPassword"
                    className="input-custom"
                    placeholder="New Password"
                    value={forgotData.newPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input-custom"
                    placeholder="Confirm New Password"
                    value={forgotData.confirmPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-login" disabled={isForgotLoading}>
                  {isForgotLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
