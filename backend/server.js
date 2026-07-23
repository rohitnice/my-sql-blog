require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();

// Configure CORS for local development and Render deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://my-sql-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow to avoid unexpected CORS blocks in deployment
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/posts/:postId/likes', likeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Server listening live on port ${PORT}`);
});