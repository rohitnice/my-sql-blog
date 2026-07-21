const express = require('express');
const router = express.Router({ mergeParams: true });
const likeController = require('../controllers/likeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

// Get likes count
router.get('/count', likeController.getLikesCount);

// Check if user liked (with optional auth)
router.get('/check', optionalAuthMiddleware, likeController.checkUserLike);

// Like a post (requires auth)
router.post('/', authMiddleware, likeController.likePost);

// Unlike a post (requires auth)
router.delete('/', authMiddleware, likeController.unlikePost);

module.exports = router;