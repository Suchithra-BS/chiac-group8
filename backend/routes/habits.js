const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Habit = require('../models/Habit');

const router = express.Router();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Get all habits for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Error fetching habits' });
  }
});

// Get a single habit
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    res.status(500).json({ message: 'Error fetching habit' });
  }
});

// Create a new habit
router.post('/', [
  authenticateToken,
  body('name').notEmpty().trim().isLength({ max: 100 }),
  body('frequency').isIn(['daily', 'weekly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, frequency } = req.body;

    const habit = new Habit({
      name,
      frequency,
      user: req.userId
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Error creating habit' });
  }
});

// Update a habit
router.put('/:id', [
  authenticateToken,
  body('name').optional().notEmpty().trim().isLength({ max: 100 }),
  body('frequency').optional().isIn(['daily', 'weekly']),
  body('progress').optional().isNumeric().isFloat({ min: 0, max: 100 }),
  body('streak').optional().isNumeric().isInt({ min: 0 }),
  body('completed').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Update fields
    const allowedUpdates = ['name', 'frequency', 'progress', 'streak', 'completed', 'lastCompleted'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(habit, updates);
    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Error updating habit' });
  }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = habit.lastCompleted ?
      habit.lastCompleted.toISOString().split('T')[0] : null;

    // Check if already completed today
    if (lastCompleted === today && habit.completed) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    // Calculate progress increment
    const increment = habit.frequency === 'daily' ? 100 / 7 : 100 / 4;

    habit.completed = true;
    habit.streak += 1;
    habit.progress = Math.min(100, habit.progress + increment);
    habit.lastCompleted = new Date();

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ message: 'Error toggling habit completion' });
  }
});

// Undo habit completion
router.patch('/:id/undo', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (!habit.completed) {
      return res.status(400).json({ message: 'Habit is not completed' });
    }

    // Calculate progress decrement
    const decrement = habit.frequency === 'daily' ? 100 / 7 : 100 / 4;

    habit.completed = false;
    habit.streak = Math.max(0, habit.streak - 1);
    habit.progress = Math.max(0, habit.progress - decrement);
    habit.lastCompleted = null;

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error('Error undoing habit completion:', error);
    res.status(500).json({ message: 'Error undoing habit completion' });
  }
});

// Delete a habit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Error deleting habit' });
  }
});

module.exports = router;
