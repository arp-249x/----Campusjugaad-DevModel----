import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  xp: { type: Number, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'urgent'], default: 'medium' },
  location: { type: String, required: true },
  deadline: { type: String, required: true },
  deadlineIso: { type: Date, required: true },
  postedBy: { type: String, required: true },
  status: { type: String, enum: ['open', 'active', 'completed', 'expired'], default: 'open' },
  otp: { type: String },
  assignedTo: { type: String, default: null },
  // 👇 NEW: Check if rating was given
  ratingGiven: { type: Boolean, default: false }
}, { timestamps: true });

export const Quest = mongoose.model('Quest', QuestSchema);