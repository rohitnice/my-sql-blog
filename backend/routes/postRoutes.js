const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Post routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.delete('/:id', postController.deletePost);

module.exports = router;