const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly']
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastCompleted: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
