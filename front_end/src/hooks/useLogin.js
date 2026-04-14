import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setStoredItem, clearUserData, removeStoredItem } from '../utils/storageUtils';

export const useLogin = () => {
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

  const login = async (email, password) => {
    const loginEmail = email || formData.email;
    const loginPassword = password || formData.password;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful!', data);

        // Clear any existing user data from localStorage
        clearUserData();
        
        // Clear old generic keys that might exist
        removeStoredItem('favorites');
        removeStoredItem('orderHistory');
        removeStoredItem('lastOrder');
        removeStoredItem('cartItems');

        // Store user data in localStorage
        const userData = {
          email: data.user.email,
          name: data.user.name,
          id: data.user.id || data.user._id || `user_${Date.now()}`,
          loginTime: new Date().toISOString()
        };
        setStoredItem('user', userData);

        // navigate('/home'); // Redirect to homepage moved to component for splash screen
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearError = () => setError('');

  return {
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
    setFormData
  };
};
