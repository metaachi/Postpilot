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
console.log(`DB_URL: ${process.env.DB_URL ? 'Set (MongoDB Atlas)' : 'Not Set'}`);

// In-memory storage as fallback when DB is not available
const inMemoryUsers = [];
let dbConnected = false;

// Try to connect to MongoDB
connectDB()
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully');
    dbConnected = true;
  })
  .catch(err => {
    console.log('⚠️ Warning: MongoDB Connection Failed:', err.message);
    console.log('⚠️ Server will continue running with in-memory storage');
    console.log('⚠️ Please check your MongoDB Atlas connection string in .env file');
  });

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());

// Basic GET endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI TWIN Backend',
    dbStatus: dbConnected ? 'Connected to MongoDB Atlas' : 'Using in-memory storage (MongoDB not connected)'
  });
});

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
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 JWT Authentication: ${process.env.JWT_SECRET ? 'Configured' : 'Using fallback key'}`);
  console.log(`💾 Database: ${dbConnected ? 'Connected to MongoDB Atlas' : 'Using in-memory storage (MongoDB not connected)'}\n`);
  
  console.log('📍 Available Endpoints:');
  console.log('   GET  / - Server status');
  console.log('   POST /api/signup - Create a new user');
  console.log('   POST /api/login - Authenticate user\n');
  
  if (!dbConnected) {
    console.log('⚠️ Note: Server is running with in-memory storage.');
    console.log('   User data will be lost when the server restarts.');
    console.log('   To enable persistent storage, connect to MongoDB Atlas.\n');
  }
}); 