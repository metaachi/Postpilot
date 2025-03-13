// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Log environment variables (excluding sensitive data)
console.log('Environment Variables Loaded:');
console.log(`PORT: ${PORT}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`);
console.log(`DB_URL: ${process.env.DB_URL ? 'Set' : 'Not Set'}`);

// Try to connect to MongoDB but proceed anyway
connectDB()
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.log('⚠️ Warning: Database connection failed:', err.message);
    console.log('Server will continue running without database connection');
  });

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());

// Basic GET endpoint
app.get('/', (req, res) => {
  res.json({ message: 'AI TWIN Backend' });
});

// In-memory storage for demo purposes when DB is not available
const inMemoryUsers = [];

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log the request for debugging
    console.log('Signup request received for:', email);

    // For testing purposes - check in memory
    const existingUser = inMemoryUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      email,
      password: 'hashed-' + password, // Simulate hashing
      createdAt: new Date()
    };

    // Add to in-memory storage
    inMemoryUsers.push(newUser);
    console.log('User created in memory:', newUser.email);

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log the request for debugging
    console.log('Login request received for:', email);

    // Find user by email in memory
    const user = inMemoryUsers.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Simple password check for demo
    const isValidPassword = user.password === 'hashed-' + password;
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-jwt-secret',
      { expiresIn: '24h' }
    );

    // Return token and user data
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server Configuration:');
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 JWT Authentication: ${process.env.JWT_SECRET ? 'Configured' : 'Using fallback key'}`);
  console.log(`💾 Database: ${process.env.DB_URL ? 'Configured, but may not be connected' : 'Not Configured'}\n`);
  console.log('📍 Endpoints available:');
  console.log('   GET  /');
  console.log('   POST /api/signup');
  console.log('   POST /api/login\n');
}); 