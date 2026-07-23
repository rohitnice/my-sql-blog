const db = require('../config/db');
const axios = require('axios');

// FastApi Endpoint for AI / Vector Indexing
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

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

// Insert a new post into MySQL & Automatically Index into AstraDB
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
        // 1. Insert into MySQL
        const query = 'INSERT INTO posts (title, author, excerpt, content, date) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [title, author, excerpt, content, postDate]);
        const newPostId = result.insertId;

        // 2. Index the new post into AstraDB via Python FastAPI Backend
        try {
            await axios.post(`${FASTAPI_URL}/index`, {
                post_id: String(newPostId),
                title: title,
                desc: content || excerpt
            });
            console.log(`Successfully indexed post #${newPostId} into AstraDB`);
        } catch (aiErr) {
            console.error('FastAPI Indexing Warning:', aiErr.message);
            // We log the error but don't fail the response, ensuring post creation in MySQL succeeds regardless
        }

        res.status(201).json({ message: 'Post created successfully!', postId: newPostId });
    } catch (err) {
        console.error('createPost error:', err);
        res.status(500).json({ error: 'Database error saving post' });
    }
};

// Delete a post from MySQL & Remove Embeddings from AstraDB
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Delete from MySQL
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // 2. Remove embedding index from AstraDB
        try {
            await axios.delete(`${FASTAPI_URL}/index/${id}`);
            console.log(`Successfully deleted vector index for post #${id}`);
        } catch (aiErr) {
            console.error('FastAPI Index Deletion Warning:', aiErr.message);
        }

        res.json({ message: 'Post and corresponding vector index deleted successfully!' });
    } catch (err) {
        console.error('deletePost error:', err);
        res.status(500).json({ error: 'Database error deleting post' });
    }
};