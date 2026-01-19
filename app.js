// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app before starting the server
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  // Sync database and start server
  const PORT = process.env.PORT || 3000;
  const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to start server:', error);
      process.exit(1);
    }
  };

  startServer();

  // test export for CI/CD purposes
}