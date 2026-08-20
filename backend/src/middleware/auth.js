const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024');
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    console.log('✅ User authenticated:', req.user.username);
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('✅ Admin authorized:', req.user.username);
    next();
  } else {
    console.log('❌ Not admin user');
    res.status(403).json({ error: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };