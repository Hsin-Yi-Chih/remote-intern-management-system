const express = require('express');
const router = express.Router();
const {  getAssignments, addAssignment, updateAssignment, deleteAssignment } = require('../controllers/assignmentController'); 
const { protect } = require('../middleware/authMiddleware');
 
router.get('/', protect, getAssignments); 
router.post('/', protect, addAssignment); 
router.put('/:id', protect, updateAssignment); 
router.delete('/:id', protect, deleteAssignment);  

module.exports = router;