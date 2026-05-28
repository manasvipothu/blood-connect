module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific room based on user role or ID
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    // Handle emergency blood request notifications
    socket.on('emergency_request', (data) => {
      // Broadcast to all connected clients except sender
      socket.broadcast.emit('new_emergency', data);
      console.log('Emergency request broadcasted:', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
