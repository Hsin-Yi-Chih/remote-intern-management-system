const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  assignedIntern: { type: String },
  startDate: { type: Date },
  deadline: { type: Date },
  completed: { type: Boolean, default: false }
 }, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);