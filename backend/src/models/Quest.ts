import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  xp: { type: Number, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'urgent'], default: 'medium' },
  location: { type: String, required: true },
  deadline: { type: String, required: true },     // Display string (e.g., "2 hours")
  deadlineIso: { type: Date, required: true },    // Actual Date object
  postedBy: { type: String, required: true },     // Username of the poster
  status: { type: String, enum: ['open', 'active', 'completed', 'expired'], default: 'open' },
  otp: { type: String },                          // Secret OTP
  assignedTo: { type: String, default: null }     // Username of the Hero
}, { timestamps: true });

export const Quest = mongoose.model('Quest', QuestSchema);