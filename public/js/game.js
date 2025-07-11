const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Apenas feedback visual de que recebeu um tiro
socket.on('shotFired', (data) => {
  console.log('Recebeu tiro do celular!', data);

  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 20, 0, Math.PI * 2);
  ctx.fill();
});
