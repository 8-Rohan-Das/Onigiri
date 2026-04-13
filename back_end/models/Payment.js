import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Cash on Delivery']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  transactionId: {
    type: String,
    required: function() {
      // transactionId might not be required for Cash on Delivery
      return this.method !== 'Cash on Delivery';
    }
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema, 'payments');

export default Payment;
