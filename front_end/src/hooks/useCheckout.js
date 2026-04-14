import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredUser, setUserStoredItem, getUserStoredItem, removeStoredItem } from '../utils/storageUtils';
import { deliveryAPI, paymentAPI, userAPI } from '../services/api';

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
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  // Fetch user's saved address to pre-populate checkout form
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userId = userData?.id || userData?._id;
        if (userId) {
          const response = await userAPI.getProfile(userId);
          const profileData = response.data;
          const primaryAddress = profileData.addresses && profileData.addresses.length > 0
            ? profileData.addresses[0]
            : null;

          if (primaryAddress) {
            setFormData(prev => ({
              ...prev,
              address: primaryAddress.street || prev.address,
              city: primaryAddress.city || prev.city,
              state: primaryAddress.state || prev.state,
              zipCode: primaryAddress.zipCode || prev.zipCode
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user address for checkout:', error);
      }
    };

    fetchUserAddress();
  }, []);

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

  const handleSubmit = async (e) => {
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

    // Map payment method label for backend
    const paymentMethodMap = {
      cod: 'Cash on Delivery',
      card: 'Credit/Debit Card',
      upi: 'UPI'
    };

    try {
      // Build delivery payload for backend
      // Cart items may not have MongoDB product ObjectIds (local/demo items),
      // so we send name & price as embedded data and omit the product ref for those.
      const deliveryItems = cartItems.map((item) => ({
        ...(item._id ? { product: item._id } : {}),
        quantity: item.quantity || 1,
        price: item.price,
        name: item.name   // kept for display in confirmation
      }));

      const deliveryPayload = {
        user: userData?.id || userData?._id || null,
        items: deliveryItems,
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'India'
        },
        totalAmount: total
      };

      // POST delivery to database
      const deliveryRes = await deliveryAPI.createDelivery(deliveryPayload);
      const savedDelivery = deliveryRes.data;

      // POST payment to database
      const paymentPayload = {
        delivery: savedDelivery._id,
        user: userData?.id || userData?._id || null,
        method: paymentMethodMap[formData.paymentMethod] || formData.paymentMethod,
        amount: total
      };

      const paymentRes = await paymentAPI.processPayment(paymentPayload);
      const savedPayment = paymentRes.data;

      // Build local order record including DB ids for later reference
      const orderPayload = {
        orderNumber,
        deliveryId: savedDelivery._id,
        paymentId: savedPayment._id,
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
        status: savedDelivery.status || 'Pending',
        timestamp: new Date().toISOString()
      };

      // Save to localStorage for confirmation page & history
      setUserStoredItem('lastOrder', orderPayload);
      const currentHistory = getUserStoredItem('orderHistory', []);
      const updatedHistory = Array.isArray(currentHistory)
        ? [orderPayload, ...currentHistory]
        : [orderPayload];
      setUserStoredItem('orderHistory', updatedHistory);

      // Clear cart only after successful API save
      clearCart();

      console.log('Order saved to DB — Delivery:', savedDelivery._id, '| Payment:', savedPayment._id);
      navigate('/order-confirmation', { state: { orderNumber } });

    } catch (error) {
      console.error('Order submission failed:', error);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error || error.message;
      alert(`Failed to place order: ${serverMessage}\n\nPlease try again.`);
    }
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
