const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const aiController = require('../controllers/aiProxyController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);

router.post('/ai/excerpt', aiController.generateExcerpt);
router.post('/ai/title-ideas', aiController.generateTitleIdeas);
router.post('/ai/grammar-check', aiController.grammarCheck);
router.post('/ai/chat', aiController.chat);

module.exports = router;