import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setStoredItem, clearUserData, removeStoredItem } from '../utils/storageUtils';

export const useSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', strength: 'Weak' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    // Real API call to the backend
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign up successful!', data);
        
        // Clear any existing user data from localStorage
        clearUserData();
        
        // Clear old generic keys that might exist
        removeStoredItem('favorites');
        removeStoredItem('orderHistory');
        removeStoredItem('lastOrder');
        removeStoredItem('cartItems');
        
        // Store user data with proper ID
        setStoredItem('user', {
          id: data.user?.id || data.user?._id || `user_${Date.now()}`,
          name: formData.name,
          email: formData.email,
          token: data.token // If you plan to add tokens later
        });
        // navigate('/home'); // Moved to component for splash screen logic
        return true;
      } else {
        setError(data.message || 'Sign up failed. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Connection error. Is the server running?');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    passwordStrength,
    error,
    isLoading,
    handleChange,
    handleSubmit
  };
};
