// Simple test to verify localStorage functionality
// Run this in browser console to test

// Test 1: Save a test order
const testOrder = {
  orderNumber: 'ORD' + Date.now(),
  items: [{name: 'Test Item', price: 100, quantity: 1}],
  subtotal: 100,
  deliveryFee: 40,
  tax: 5,
  total: 145,
  timestamp: new Date().toISOString()
};

// Save to localStorage
localStorage.setItem('testOrder', JSON.stringify(testOrder));
console.log('Test order saved:', testOrder);

// Retrieve and verify
const retrieved = JSON.parse(localStorage.getItem('testOrder'));
console.log('Retrieved order:', retrieved);

// Test order history
const currentHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
console.log('Current order history:', currentHistory);

// Add test order to history
const updatedHistory = [testOrder, ...currentHistory];
localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
console.log('Updated history:', updatedHistory);

// Verify it was saved
const verifyHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
console.log('Verified history:', verifyHistory);

console.log('Test completed! Check if orders appear in order history page.');
