const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => {
  console.log('Novo dispositivo conectado');

  socket.on('shotFired', data => {
    // repassa pro jogo
    socket.broadcast.emit('shotFired', data);
  });

  socket.on('disconnect', () => {
    console.log('Dispositivo desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
