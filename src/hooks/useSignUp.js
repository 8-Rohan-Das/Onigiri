import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setStoredItem } from '../utils/storageUtils';

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

    // Simulate API call
    setTimeout(() => {
      console.log('Sign up successful!', formData);
      // Store user data and redirect to homepage
      setStoredItem('user', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/home'); // Redirect to homepage after successful signup
      setIsLoading(false);
    }, 1500);
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
