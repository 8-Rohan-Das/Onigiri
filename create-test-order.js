// Create a test order to verify the order history page works
const testOrder = {
  orderNumber: 'ORD' + Date.now(),
  items: [
    {id: 'def-1', name: 'Vegan Pizza Dough', quantity: 1, price: 120, icon: '🍕'},
    {id: 'def-2', name: 'Pepperoni Pizza', quantity: 1, price: 180, icon: '🍕'}
  ],
  subtotal: 300,
  deliveryFee: 40,
  tax: 15,
  total: 355,
  deliveryInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    address: 'Test Address',
    city: 'Test City',
    state: 'Test State',
    zipCode: '123456'
  },
  paymentMethod: 'cod',
  timestamp: new Date().toISOString()
};

// Save to localStorage
localStorage.setItem('orderHistory', JSON.stringify([testOrder]));
console.log('Test order saved to orderHistory:', testOrder);
console.log('Navigate to /order-history to see if it appears');
