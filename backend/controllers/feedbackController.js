//Get Feedback Function (Read)
const Feedback = require('../models/Feedback');

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
  const { assignedIntern, title, comments, visibility, submittedAt} = req.body;
  try {
    const feedback = await Feedback.create({ userId: req.user.id, assignedIntern, title, comments, visibility, ...(submittedAt ? { submittedAt } : {}) 
  });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Feedback:
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    if (String(feedback.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { assignedIntern, title, comments, visibility } = req.body;
    if (assignedIntern !== undefined) feedback.assignedIntern = assignedIntern;
    if (title !== undefined) feedback.title = title;
    if (comments !== undefined) feedback.comments = comments;
    if (visibility !== undefined) feedback.visibility = visibility;

    const updated = await feedback.save();
    res.json(updated);
  } catch (error) {
    console.error('updateFeedback error:', error);
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