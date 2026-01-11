import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  xp: { type: Number, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'urgent'], default: 'medium' },
  location: { type: String, required: false },
  deadline: { type: String, required: true },
  deadlineIso: { type: Date, required: true },
  postedBy: { type: String, required: true },
  status: { type: String, enum: ['open', 'active', 'completed', 'expired', 'disputed', 'resolved'], default: 'open' },
  otp: { type: String },
  assignedTo: { type: String, default: null },
  ratingGiven: { type: Boolean, default: false },
  
  dispute: {
    raisedBy: { type: String }, 
    reason: { type: String },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    adminComment: { type: String },
    createdAt: { type: Date },
    // To track if money needs to be clawed back
    previousStatus: { type: String } 
  },
  
  bids: [{
    heroUsername: { type: String, required: true },
    amount: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });


export const Quest = mongoose.model('Quest', QuestSchema);
