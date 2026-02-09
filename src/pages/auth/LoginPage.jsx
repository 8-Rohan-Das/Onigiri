import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { setStoredItem } from '../../utils/storageUtils.js';
import logo from '../../assets/logo.png';
const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', strength: 'Weak' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const analyzePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];
    
    // Length analysis
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');
    
    // Character variety
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Add symbols');
    
    // Common patterns check
    const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'user', 'login'];
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score -= 1;
      feedback.push('Avoid common patterns');
    }
    
    // Predictability check
    if (/(.)\1{2,}/.test(password)) { // Repeating characters
      score -= 1;
      feedback.push('Avoid repeating characters');
    }
    
    if (/123|abc|qwe/i.test(password)) { // Sequential patterns
      score -= 1;
      feedback.push('Avoid sequential patterns');
    }
    
    // Determine strength
    let strength = 'Weak';
    if (score >= 6) strength = 'Strong';
    else if (score >= 4) strength = 'Medium';
    
    return {
      score: Math.max(0, Math.min(6, score)),
      feedback: feedback.length > 0 ? feedback[0] : '',
      strength
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);
    
    // Analyze password strength when password changes
    if (name === 'password') {
      setPasswordStrength(analyzePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider} coming soon!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'user@onigiri.com' && formData.password === 'password') {
        console.log('Login successful!');
        
        // Store user data in localStorage
        const userData = {
          email: formData.email,
          name: 'John Doe', // Default name for demo
          id: 'user123',
          loginTime: new Date().toISOString()
        };
        setStoredItem('user', userData);
        
        navigate('/home'); // Redirect to homepage after successful login
      } else {
        setError('Invalid email or password. Try user@onigiri.com / password');
      }
      setIsLoading(false);
    }, 1500);
  };

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
                onFocus={() => setError('')}
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
                  onFocus={() => setError('')}
                  style={{ paddingRight: '45px' }}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
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
              <a href="#" className="forgot">Forgot password?</a>
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
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('Google')}>
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
            Don't have an account? <Link to="/signup" className="signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
