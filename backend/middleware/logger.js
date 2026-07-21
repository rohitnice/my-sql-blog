const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to: ${req.url}`);
    next();
};

module.exports = requestLogger;