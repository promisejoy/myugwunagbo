const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured in environment variables');
      return res.status(500).json({ error: 'Internal server error: auth configuration missing' });
    }

    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token is malformed' });
    }

    // Verify token payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Normalize user object across different JWT standard payload structures (e.g. id, sub)
    const userId = decoded.id || decoded.sub || decoded.user_id;

    if (!userId) {
      console.error('❌ Invalid token payload structure:', decoded);
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Attach user payload to request object
    req.user = {
      id: userId,
      username: decoded.username || decoded.email || null,
      role: decoded.role || 'user',
      ...decoded
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token signature or payload', code: 'INVALID_TOKEN' });
    }

    console.error('❌ Auth Middleware Error:', error.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;