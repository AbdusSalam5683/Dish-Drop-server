// dish-drop-server/src/models/Report.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  reporterEmail: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['Spam', 'Offensive Content', 'Copyright Issue', 'Other']
  },
  status: {
    type: String,
    enum: ['pending', 'dismissed', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;