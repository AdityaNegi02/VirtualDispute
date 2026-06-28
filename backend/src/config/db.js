// backend/src/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Drop old email index if it exists to prevent conflict with mobile-based auth
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
      console.log('Stale email index dropped successfully.');
    } catch (err) {
      // Index might not exist, which is fine
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;