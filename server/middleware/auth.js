const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bitesize_jwt_secret_token_secure_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied: Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
