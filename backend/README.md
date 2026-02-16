# Habit Tracker Backend

A Node.js/Express backend API for the habit tracking application.

## Features

- User authentication (register/login)
- CRUD operations for habits
- JWT-based authentication
- MongoDB data persistence
- Input validation and error handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Make sure MongoDB is running on your system

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Habits (requires authentication)
- `GET /api/habits` - Get all user's habits
- `GET /api/habits/:id` - Get a specific habit
- `POST /api/habits` - Create a new habit
- `PUT /api/habits/:id` - Update a habit
- `PATCH /api/habits/:id/toggle` - Toggle habit completion
- `DELETE /api/habits/:id` - Delete a habit

## Authentication

All habit endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### User
- username (string, required)
- email (string, required, unique)
- password (string, required)

### Habit
- name (string, required)
- frequency (string, enum: 'daily'|'weekly')
- progress (number, default: 0)
- streak (number, default: 0)
- completed (boolean, default: false)
- lastCompleted (date, optional)
- user (ObjectId, ref: User)
