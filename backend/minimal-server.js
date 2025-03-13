// Minimal Express server for testing
const express = require('express');
const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());

// Basic GET endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Hello from minimal server' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Minimal server is running on http://localhost:${PORT}`);
}); 