// dish-drop-server/src/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;