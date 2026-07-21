const db = require('../config/db');

// Fetch all posts from MySQL
exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        console.error('getAllPosts error:', err);
        res.status(500).json({ error: 'Database error reading posts' });
    }
};

// Fetch a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('getPostById error:', err);
        res.status(500).json({ error: 'Database error fetching post details' });
    }
};

// Insert a new post into MySQL
exports.createPost = async (req, res) => {
    const { title, author, excerpt, content, date } = req.body;

    if (!title || !author || !excerpt || !content) {
        return res.status(400).json({ error: 'Title, author, excerpt and content are required' });
    }

    let postDate = date ? new Date(date) : new Date();
    if (isNaN(postDate)) {
        postDate = new Date();
    }

    try {
        const query = 'INSERT INTO posts (title, author, excerpt, content, date) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [title, author, excerpt, content, postDate]);
        res.status(201).json({ message: 'Post created successfully!', postId: result.insertId });
    } catch (err) {
        console.error('createPost error:', err);
        res.status(500).json({ error: 'Database error saving post' });
    }
};