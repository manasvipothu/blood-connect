const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const setupSockets = require('./sockets/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*', // We will update this to frontend URL later
    methods: ['GET', 'POST']
  }
});
setupSockets(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const bankRoutes = require('./routes/bankRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const driveRoutes = require('./routes/driveRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/drives', driveRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Blood Connect API is running' });
});

const { syncDB } = require('./models');

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

