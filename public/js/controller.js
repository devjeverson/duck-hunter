const socket = io();

document.getElementById('shoot').addEventListener('click', () => {
  socket.emit('shotFired', {
    timestamp: Date.now()
    // futuramente: posição do giroscópio, intensidade, etc.
  });
});
