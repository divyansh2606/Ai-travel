const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  time: String,
  activity: String,
  location: String,
  type: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'relaxation']
  }
});

const DaySchema = new mongoose.Schema({
  day: Number,
  date: String,
  activities: [ActivitySchema]
});

const TravelPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  interests: [String],
  itinerary: {
    destination: String,
    duration: String,
    interests: [String],
    itinerary: [DaySchema],
    raw: Boolean
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'completed'],
    default: 'draft'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
TravelPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('TravelPlan', TravelPlanSchema);
