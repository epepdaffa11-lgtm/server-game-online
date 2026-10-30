const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Biar bisa diakses dari mana aja
});

// Bikin rute web sederhana buat ngetes
app.get('/', (req, res) => {
  res.send('Server Game Online Jalan!');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    const clients = io.sockets.adapter.rooms.get(roomId);
    const numClients = clients ? clients.size : 0;

    if (numClients === 2) {
      io.to(roomId).emit('startGame', { message: 'Game dimulai! Player 1 jalan duluan.' });
    } else {
      socket.emit('waiting', 'Menunggu pemain lain bergabung...');
    }
  });
});

// Render butuh port dinamis
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
