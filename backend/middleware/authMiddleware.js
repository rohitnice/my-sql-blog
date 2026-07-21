const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-env';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
            req.username = decoded.username;
        } catch (err) {
            console.error('Optional auth error:', err);
            // Silently fail, continue without user
        }
    }
    next();
};

module.exports = { authMiddleware, optionalAuthMiddleware };