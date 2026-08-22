const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const chatRoutes = require('./routes/chat.routes');



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

// ============================================
// ✅ SIMPLEST CORS - ALLOW EVERYTHING (FOR TESTING)
// ============================================
// This allows ANY origin to access your API
// Once everything works, you can restrict it
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================
// Helmet (with relaxed settings)
// ============================================
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging middleware
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



// ============================================
// Check if we're in production environment
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build folder
  // Adjust the path to where your React build files are located
  const buildPath = path.join(__dirname, '../client/build'); // or wherever your build is
  
  // Serve static assets
  app.use(express.static(buildPath));
  
  // Catch-all route to serve index.html for any non-API request
  app.get('*', (req, res) => {
    // Skip API routes - they should have been handled already
    if (req.path.startsWith('/api/') || req.path === '/api' || req.path === '/') {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}


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
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVE REACT APP FOR NON-API ROUTES
// ============================================
// This must come AFTER your API routes but BEFORE the 404 handler

// Get the path to the React build directory
// Adjust this path based on your actual build location
const reactBuildPath = path.join(__dirname, '../../client/build'); // Adjust as needed

// Check if build exists (production only)
const fs = require('fs');
if (fs.existsSync(reactBuildPath) && process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(reactBuildPath));
  
  // Catch-all for React routes
  app.get('*', (req, res, next) => {
    // Skip API routes (should have been handled already)
    if (req.path.startsWith('/api/') || req.path === '/api') {
      return next(); // Pass to 404 handler
    }
    // Send index.html for all other routes
    res.sendFile(path.join(reactBuildPath, 'index.html'));
  });
}

// Then your existing 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: `Route not found: ${req.method} ${req.url}`
  });
});

module.exports = app;