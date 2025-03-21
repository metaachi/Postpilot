const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB (removing deprecated options)
    const conn = await mongoose.connect(process.env.DB_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Instead of process.exit(1), we'll throw the error for the caller to handle
    throw error;
  }
};

module.exports = connectDB; 