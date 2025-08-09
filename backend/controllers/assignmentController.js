//Get Assignment Function (Read)
const Assignment = require('../models/Assignments');

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ userId: req.user.id });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Add Assignment Function:
const addAssignment = async (req, res) => {
  const { title, description, assignedIntern, startDate, deadline } = req.body;
  try {
    const assignment = await Assignment.create({ userId: req.user.id, title, description, assignedIntern, startDate, deadline });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Assignment:
const updateAssignment = async (req, res) => {
  const { title, description, startDate, deadline, completed } = req.body;
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

// assignedIntern is not allowed to update
    if (Object.prototype.hasOwnProperty.call(req.body, 'assignedIntern') &&
        req.body.assignedIntern !== assignment.assignedIntern) {
      return res.status(400).json({ message: 'Assigned intern cannot be changed.' });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.startDate = startDate || assignment.startDate;
    assignment.deadline = deadline || assignment.deadline;
    assignment.completed = completed ?? assignment.completed;

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Assignment:
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    await assignment.remove();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignments, addAssignment, updateAssignment, deleteAssignment };