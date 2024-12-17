const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Static file untuk frontend
app.use(express.static('frontend'));

// WebSocket untuk komunikasi real-time
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendLocation', (locationData) => {
    console.log('Received location:', locationData);
    // Kirim lokasi ke semua client
    socket.broadcast.emit('updateLocation', locationData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
