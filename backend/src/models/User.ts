import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In real apps, we hash this!
  dob: { type: String, required: true },
  xp: { type: Number, default: 0 },
  balance: { type: Number, default: 450 }, // Starting balance
  joinedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);