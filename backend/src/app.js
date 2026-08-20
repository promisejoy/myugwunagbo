const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth.routes');
const governorRoutes = require('./routes/governor.routes');
const leaderRoutes = require('./routes/leader.routes');
const newsRoutes = require('./routes/news.routes');
const villageRoutes = require('./routes/village.routes');
const contactRoutes = require('./routes/contact.routes');
const serviceRoutes = require('./routes/service.routes');
const forumRoutes = require('./routes/forum.routes');
const traditionalRulerRoutes = require('./routes/traditional-ruler.routes');
const ngoRoutes = require('./routes/ngo.routes');
const academiaRoutes = require('./routes/academia.routes');
const galleryRoutes = require('./routes/gallery.routes');
const leadershipHistoryRoutes = require('./routes/leadership-history.routes');
const notificationRoutes = require('./routes/notification.routes');
const budgetRoutes = require('./routes/budget.routes');

const app = express();

// Middleware
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ============================================
// ✅ FIXED CORS CONFIGURATION
// ============================================
// CORS CONFIGURATION - Allow all Vercel URLs
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://myugwunagbo-8mw4.vercel.app',
  // Allow all Vercel preview URLs
  /\.vercel\.app$/,
  /\.vercel\.app\/.*$/,
  process.env.CLIENT_URL
].filter(Boolean);

console.log('🌐 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Clean the origin (remove trailing slash)
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // Check if the clean origin is allowed (including regex patterns)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(cleanOrigin);
      }
      return allowed.toLowerCase() === cleanOrigin.toLowerCase();
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked:', origin);
      console.log('   Allowed origins:', allowedOrigins);
      callback(new Error(`CORS blocked: ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files (if you have any)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log all requests (custom)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📝 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: 'Supabase',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Ugwunagbo API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      governor: '/api/governor',
      leaders: '/api/leaders',
      news: '/api/news',
      villages: '/api/villages',
      contacts: '/api/contacts',
      services: '/api/service-applications',
      forum: '/api/forum',
      traditionalRulers: '/api/traditional-rulers',
      ngos: '/api/ngos-foundations',
      academia: '/api/academia',
      gallery: '/api/gallery',
      leadershipHistory: '/api/leadership-history',
      notifications: '/api/notifications'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/governor', governorRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/service-applications', serviceRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/traditional-rulers', traditionalRulerRoutes);
app.use('/api/ngos-foundations', ngoRoutes);
app.use('/api/academia', academiaRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/leadership-history', leadershipHistoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/budgets', budgetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: `Route not found: ${req.method} ${req.url}`,
    message: 'The endpoint you are looking for does not exist'
  });
});

module.exports = app;