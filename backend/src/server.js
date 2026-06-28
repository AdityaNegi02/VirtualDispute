const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB().then(() => {
  console.log('Database connection established.');
}).catch(err => {
  console.error('Failed to connect to database', err);
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production!
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_case', (caseId) => {
    socket.join(caseId);
    console.log(`User ${socket.id} joined case: ${caseId}`);
  });

  socket.on('send_message', (data) => {
    // Broadcast message to everyone in the case room
    io.to(data.caseId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running', timestamp: new Date() });
});

// Mount the dispute routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});