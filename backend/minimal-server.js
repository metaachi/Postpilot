// Enhanced minimal Express server with MongoDB and Auth routes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3003; // Keep using port 3003 since we know it works

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user store as fallback
const users = [];
let dbConnected = false;

// Log configuration
console.log('Environment Variables:');
console.log(`PORT: ${PORT}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not Set'}`);
console.log(`DB_URL: ${process.env.DB_URL ? 'Set' : 'Not Set'}`);

// Try to connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.DB_URL) {
      await mongoose.connect(process.env.DB_URL);
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      dbConnected = true;
      return true;
    } else {
      console.log('⚠️ No MongoDB URL provided, using in-memory storage');
      return false;
    }
  } catch (err) {
    console.error('⚠️ MongoDB Connection Error:', err.message);
    console.log('⚠️ Using in-memory storage instead');
    return false;
  }
};

// Basic GET endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI TWIN Backend', 
    database: dbConnected ? 'MongoDB Atlas' : 'In-memory storage'
  });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Signup request received for:', email);
    
    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password (simplified)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    // Save to in-memory database
    users.push(newUser);
    console.log('User created:', email);
    
    // Return user without password
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Login request received for:', email);
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-jwt-secret',
      { expiresIn: '24h' }
    );
    
    // Return token and user
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect to database, then start server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log('\n🚀 Server Configuration:');
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 JWT Authentication: ${process.env.JWT_SECRET ? 'Configured' : 'Using fallback key'}`);
    console.log(`💾 Database: ${dbConnected ? 'Connected to MongoDB Atlas' : 'Using in-memory storage'}\n`);
    
    console.log('📍 Available Endpoints:');
    console.log('   GET  / - Server status');
    console.log('   POST /api/signup - Create a new user');
    console.log('   POST /api/login - Authenticate user\n');
  });
}); 