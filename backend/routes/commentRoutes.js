const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all comments for a post
router.get('/', commentController.getPostComments);

// Create a comment (requires auth)
router.post('/', authMiddleware, commentController.createComment);

// Delete a comment (requires auth)
router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;