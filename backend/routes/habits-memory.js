const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, decoded) => {
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
    const userHabits = global.habits.filter(habit => habit.user === req.userId);
    res.json(userHabits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Error fetching habits' });
  }
});

// Get a single habit
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const habit = global.habits.find(h => h._id === req.params.id && h.user === req.userId);
    
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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, frequency } = req.body;

    if (!name || !frequency) {
      return res.status(400).json({ message: 'Name and frequency are required' });
    }

    if (!['daily', 'weekly'].includes(frequency)) {
      return res.status(400).json({ message: 'Frequency must be daily or weekly' });
    }

    const habit = {
      _id: global.habitIdCounter.toString(),
      name,
      frequency,
      progress: 0,
      streak: 0,
      completed: false,
      lastCompleted: null,
      user: req.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    global.habits.push(habit);
    global.habitIdCounter++;

    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Error creating habit' });
  }
});

// Update a habit
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const habitIndex = global.habits.findIndex(h => h._id === req.params.id && h.user === req.userId);
    
    if (habitIndex === -1) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Update fields
    const allowedUpdates = ['name', 'frequency', 'progress', 'streak', 'completed', 'lastCompleted'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        global.habits[habitIndex][field] = req.body[field];
      }
    });

    global.habits[habitIndex].updatedAt = new Date().toISOString();
    
    res.json(global.habits[habitIndex]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Error updating habit' });
  }
});

// Toggle habit completion
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const habitIndex = global.habits.findIndex(h => h._id === req.params.id && h.user === req.userId);
    
    if (habitIndex === -1) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const habit = global.habits[habitIndex];
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = habit.lastCompleted ? 
      habit.lastCompleted.split('T')[0] : null;

    // Check if already completed today
    if (lastCompleted === today && habit.completed) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    // Calculate progress increment
    const increment = habit.frequency === 'daily' ? 100 / 7 : 100 / 4;

    habit.completed = true;
    habit.streak += 1;
    habit.progress = Math.min(100, habit.progress + increment);
    habit.lastCompleted = new Date().toISOString();
    habit.updatedAt = new Date().toISOString();

    res.json(habit);
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ message: 'Error toggling habit completion' });
  }
});

// Undo habit completion
router.patch('/:id/undo', authenticateToken, async (req, res) => {
  try {
    const habitIndex = global.habits.findIndex(h => h._id === req.params.id && h.user === req.userId);
    
    if (habitIndex === -1) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const habit = global.habits[habitIndex];
    
    if (!habit.completed) {
      return res.status(400).json({ message: 'Habit is not completed' });
    }

    // Calculate progress decrement
    const decrement = habit.frequency === 'daily' ? 100 / 7 : 100 / 4;

    habit.completed = false;
    habit.streak = Math.max(0, habit.streak - 1);
    habit.progress = Math.max(0, habit.progress - decrement);
    habit.lastCompleted = null;
    habit.updatedAt = new Date().toISOString();

    res.json(habit);
  } catch (error) {
    console.error('Error undoing habit completion:', error);
    res.status(500).json({ message: 'Error undoing habit completion' });
  }
});

// Delete a habit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const habitIndex = global.habits.findIndex(h => h._id === req.params.id && h.user === req.userId);
    
    if (habitIndex === -1) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    global.habits.splice(habitIndex, 1);
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Error deleting habit' });
  }
});

module.exports = router;
