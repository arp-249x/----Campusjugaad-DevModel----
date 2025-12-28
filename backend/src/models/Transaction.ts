import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Username
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' },
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);