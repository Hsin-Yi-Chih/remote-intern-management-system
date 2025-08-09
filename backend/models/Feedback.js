const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedIntern: { type: String, required: true },
  title: { type: String, required: true },
  comments: { type: String },
  visibility: { type: String , 
  enum: ['manager_intern', 'manager_only'], 
  default: 'manager_intern' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });


module.exports = mongoose.model('Feedback', feedbackSchema);