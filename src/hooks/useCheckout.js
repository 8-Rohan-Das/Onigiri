import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredUser, setStoredItem, getStoredItem, removeStoredItem } from '../utils/storageUtils';

export const useCheckout = () => {
  const navigate = useNavigate();
  
  // user data from localStorage
  const userData = getStoredUser();
  const userName = userData.name || 'Guest';

  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal 
  } = useCart();

  // mobile summary drawer toggle
  const [showSummary, setShowSummary] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    fullName: userName,
    email: userData.email || '',
    phone: '',
    address: 'Plot No. 42, Sector 5, CDA Building',
    city: 'Bhubaneswar',
    state: 'Odisha',
    zipCode: '751019',
    paymentMethod: 'cod',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  // derived totals
  const subtotal = useMemo(
    () => getCartTotal(),
    [cartItems, getCartTotal]
  );
  const deliveryFee = 40.0;
  const tax = +(subtotal * 0.05).toFixed(2); // 5% tax
  const total = +(subtotal + deliveryFee + tax).toFixed(2);

  // update form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // basic client-side validation for card fields only when card selected
  const validatePayment = () => {
    if (formData.paymentMethod === 'card') {
      // simple checks (lengths); production needs stronger validation
      const cardNumber = formData.cardNumber.replace(/\s+/g, '');
      if (!/^\d{12,19}$/.test(cardNumber)) return { ok: false, message: 'Enter a valid card number' };
      if (!formData.cardName.trim()) return { ok: false, message: 'Card name required' };
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiryDate)) return { ok: false, message: 'Expiry should be MM/YY' };
      if (!/^\d{3,4}$/.test(formData.cvv)) return { ok: false, message: 'CVV should be 3 or 4 digits' };
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) return { ok: false, message: 'Enter a valid UPI ID' };
    }
    return { ok: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items before placing an order.');
      return;
    }

    const paymentValid = validatePayment();
    if (!paymentValid.ok) {
      alert(paymentValid.message);
      return;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit Indian phone number (e.g., 9876543210).');
      return;
    }

    const orderNumber = 'ORD' + Date.now();
    const orderPayload = {
      orderNumber,
      items: cartItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryInfo: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      paymentMethod: formData.paymentMethod,
      timestamp: new Date().toISOString()
    };

    console.log('Saving order:', orderPayload);

    // Save order to localStorage first
    setStoredItem('lastOrder', orderPayload);
    
    // Also save to order history
    const currentHistory = getStoredItem('orderHistory', []);
    const updatedHistory = Array.isArray(currentHistory) 
      ? [orderPayload, ...currentHistory] 
      : [orderPayload];
    setStoredItem('orderHistory', updatedHistory);

    console.log('Order saved to localStorage');

    // Clear cart after saving order
    clearCart();

    console.log('Cart cleared, navigating to confirmation');
    navigate('/order-confirmation', { state: { orderNumber } });
  };

  const handleBackToHome = () => navigate('/home');

  const handleLogout = () => {
    // Clear user data from localStorage safely
    removeStoredItem('user');
    navigate('/login');
  };

  const toggleSummary = () => setShowSummary((prev) => !prev);

  return {
    cartItems,
    updateQuantity,
    removeFromCart,
    showSummary,
    toggleSummary,
    formData,
    handleInputChange,
    subtotal,
    deliveryFee,
    tax,
    total,
    handleSubmit,
    handleBackToHome,
    handleLogout,
    userName
  };
};
