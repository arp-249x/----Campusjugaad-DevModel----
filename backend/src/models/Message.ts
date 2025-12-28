import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  questId: { type: String, required: true },
  sender: { type: String, required: true }, // Username
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', MessageSchema);