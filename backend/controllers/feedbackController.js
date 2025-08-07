//Get Feedback Function (Read)
const Feedback = require('../models/Feedbacks');

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Add Feedback Function:
const addFeedback = async (req, res) => {
  const { assignedIntern, title, comments, linkedAssignments } = req.body;
  try {
    const feedback = await Feedback.create({ userId: req.user.id, assignedIntern, title, comments, linkedAssignments });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Feedback:
const updateFeedback = async (req, res) => {
  const { assignedIntern, title, comments, linkedAssignments } = req.body;
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    feedback.assignedIntern = assignedIntern || feedback.assignedIntern;
    feedback.title = title || feedback.title;
    feedback.comments = comments || feedback.comments;
    feedback.linkedAssignments = linkedAssignments || feedback.linkedAssignments;

    const updatedFeedback = await feedback.save();
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Feedback:
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    await feedback.remove();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeedbacks, addFeedback, updateFeedback, deleteFeedback };