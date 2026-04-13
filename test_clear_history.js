// Test script to verify clear history API endpoint
const axios = require('axios');

async function testClearHistory() {
    try {
        console.log('Testing clear history endpoint...');
        
        // Test the endpoint with sample data
        const response = await axios.delete('http://localhost:5000/api/orders/clear', {
            data: {
                deliveryIds: ['sample-delivery-id'],
                paymentIds: ['sample-payment-id']
            }
        });
        
        console.log('Response:', response.data);
        console.log('Clear history endpoint is working!');
    } catch (error) {
        console.error('Error testing clear history:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

testClearHistory();
