import { useState } from 'react';
import { authAPI } from '../services/api';

export const useForgotPassword = ({ onResetSuccess } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP & New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const openModal = () => {
    setIsOpen(true);
    setStep(1);
    setError('');
    setSuccessMessage('');
    setFormData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call real backend endpoint
      const response = await authAPI.forgotPassword(formData.email);
      
      setStep(2);
      setSuccessMessage(response.data.message || 'OTP sent successfully to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    // Mock OTP validation (accept any 6 digit OTP for demo as requested)
    if (formData.otp.length !== 6) {
      setIsLoading(false);
      setError('Invalid OTP. Please enter a 6-digit code.');
      return;
    }

    try {
      // Call real backend endpoint to update password
      const response = await authAPI.resetPassword(formData.email, formData.newPassword);

      setSuccessMessage(response.data.message || 'Password reset successfully!');

      if (onResetSuccess) {
        onResetSuccess(formData.email, formData.newPassword);
      }

      // Close modal after success delay
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    step,
    isLoading,
    error,
    successMessage,
    formData,
    openModal,
    closeModal,
    handleChange,
    handleSendOtp,
    handleResetPassword
  };
};
