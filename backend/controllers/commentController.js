const db = require('../config/db');

// Get all comments for a post
exports.getPostComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const [comments] = await db.query(
            'SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
            [postId]
        );
        res.json(comments);
    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

// Create a comment
exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Comment content is required' });
    }

    try {
        // Check if post exists
        const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Insert comment
        const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [postId, userId, content]);

        res.status(201).json({
            message: 'Comment created successfully',
            id: result.insertId,
            content,
            username: req.username,
            created_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('Create comment error:', err);
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.userId;

    try {
        // Check if comment exists and belongs to user
        const [comments] = await db.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
        if (comments.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comments[0].user_id !== userId) {
            return res.status(403).json({ error: 'You can only delete your own comments' });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};