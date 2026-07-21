const db = require('../config/db');

// Get likes count for a post
exports.getLikesCount = async (req, res) => {
    const { postId } = req.params;

    try {
        const [result] = await db.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);
        res.json({ count: result[0].count });
    } catch (err) {
        console.error('Get likes count error:', err);
        res.status(500).json({ error: 'Failed to fetch likes' });
    }
};

// Check if user liked a post
exports.checkUserLike = async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    if (!userId) {
        return res.json({ liked: false });
    }

    try {
        const [likes] = await db.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        res.json({ liked: likes.length > 0 });
    } catch (err) {
        console.error('Check like error:', err);
        res.status(500).json({ error: 'Failed to check like status' });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    try {
        // Check if post exists
        const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
        if (posts.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if already liked
        const [existing] = await db.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You already liked this post' });
        }

        // Insert like
        await db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);

        // Get new count
        const [result] = await db.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);
        res.status(201).json({ message: 'Post liked', count: result[0].count });
    } catch (err) {
        console.error('Like post error:', err);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.userId;

    try {
        // Check if like exists
        const [likes] = await db.query('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
        if (likes.length === 0) {
            return res.status(404).json({ error: 'You have not liked this post' });
        }

        // Delete like
        await db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);

        // Get new count
        const [result] = await db.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId]);
        res.json({ message: 'Post unliked', count: result[0].count });
    } catch (err) {
        console.error('Unlike post error:', err);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
};