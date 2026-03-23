import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setStoredItem } from '../utils/storageUtils';

// Mock database (mutable for this session)
let MOCK_USER = {
  email: 'user123@gmail.com',
  password: 'password'
};

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

  const updateMockCredentials = (newEmail, newPassword) => {
    MOCK_USER.email = newEmail;
    MOCK_USER.password = newPassword;
  };

  const login = async (email, password) => {
    const loginEmail = email || formData.email;
    const loginPassword = password || formData.password;

    setError('');
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (loginEmail === MOCK_USER.email && loginPassword === MOCK_USER.password) {
          console.log('Login successful!');

          // Store user data in localStorage
          const userData = {
            email: loginEmail,
            name: 'John Doe', // Default name for demo
            id: 'user123',
            loginTime: new Date().toISOString()
          };
          setStoredItem('user', userData);

          navigate('/home'); // Redirect to homepage after successful login
          resolve(true);
        } else {
          setError(`Invalid email or password. Try ${MOCK_USER.email} / ${MOCK_USER.password}`);
          resolve(false);
        }
        setIsLoading(false);
      }, 1500);
    });
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
    handleSocialLogin,
    handleSubmit,
    togglePasswordVisibility,
    clearError,
    login,
    setFormData,
    updateMockCredentials
  };
};
