const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// Use 127.0.0.1 instead of localhost to avoid issues with Node versions favoring IPv6
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habit-tracker';

const startServer = async () => {
  try {
    // Try connecting to MongoDB with a short timeout
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });

    console.log(`MongoDB connected to ${MONGODB_URI}`);

    // Use MongoDB routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/habits', require('./routes/habits'));

    app.get('/', (req, res) => {
      res.json({ message: 'Habit Tracker API is running with MongoDB!' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (MongoDB)`);
    });

  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.log('Falling back to IN-MEMORY storage');

    // Initialize in-memory storage
    global.users = [];
    global.habits = [];
    global.userIdCounter = 1;
    global.habitIdCounter = 1;

    // Use In-Memory routes
    app.use('/api/auth', require('./routes/auth-simple'));
    app.use('/api/habits', require('./routes/habits-memory'));

    app.get('/', (req, res) => {
      res.json({ message: 'Habit Tracker API is running with In-Memory Storage!' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (In-Memory)`);
    });
  }
};

startServer();
