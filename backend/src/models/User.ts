import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: String, required: true },
  xp: { type: Number, default: 0 },
  balance: { type: Number, default: 450 },
  joinedAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 5.0 },
  ratingCount: { type: Number, default: 0 },
  // Admin Flag
  isAdmin: { type: Boolean, default: false }
});


export const User = mongoose.model('User', UserSchema);
