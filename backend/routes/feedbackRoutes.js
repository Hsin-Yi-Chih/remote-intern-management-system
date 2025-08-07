const express = require('express');
const router = express.Router();
const {  getFeedbacks, addFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController'); 
const { protect } = require('../middleware/authMiddleware');
 
router.get('/', protect, getFeedbacks); 
router.post('/', protect, addFeedback); 
router.put('/:id', protect, updateFeedback); 
router.delete('/:id', protect, deleteFeedback);  

module.exports = router;