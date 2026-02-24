const express = require('express');
const path = require('path');
const { initDatabase } = require('./src/db');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = 3003;

// Middleware
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

// Home route
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Initialize database then start server
initDatabase().then(() => {
  // Import routes after DB is ready
  const authRoutes = require('./src/routes/auth');
  const quizRoutes = require('./src/routes/quiz');
  const recyclingRoutes = require('./src/routes/recycling');
  const eventsRoutes = require('./src/routes/events');
  const userRoutes = require('./src/routes/user');
  const adminRoutes = require('./src/routes/admin');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/recycling', recyclingRoutes);
  app.use('/api/events', eventsRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
