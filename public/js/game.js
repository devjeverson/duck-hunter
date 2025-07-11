const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Estado do jogo
let duck = {
  x: Math.random() * 700 + 50,
  y: Math.random() * 500 + 50,
  size: 50,
  dx: 2 + Math.random() * 2,
  dy: 2 + Math.random() * 2,
  alive: true,
};

let score = 0;

// Loop principal
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Área de mira
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);


  if (duck.alive) {
    // Atualiza posição
    duck.x += duck.dx;
    duck.y += duck.dy;

    // Rebater nas bordas
    if (duck.x <= 0 || duck.x + duck.size >= canvas.width) duck.dx *= -1;
    if (duck.y <= 0 || duck.y + duck.size >= canvas.height) duck.dy *= -1;

    // Desenha o pato
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(duck.x + duck.size / 2, duck.y + duck.size / 2, duck.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pontuação
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Pontos: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Recebe tiro do celular
socket.on('shotFired', () => {
  console.log('Tiro recebido!');

  if (!duck.alive) return;

  // Verifica se pato está no centro do canvas (área de mira)
  const hitArea = {
    x: canvas.width / 2 - 50,
    y: canvas.height / 2 - 50,
    w: 100,
    h: 100
  };

  const duckCenterX = duck.x + duck.size / 2;
  const duckCenterY = duck.y + duck.size / 2;

  const acertou =
    duckCenterX >= hitArea.x &&
    duckCenterX <= hitArea.x + hitArea.w &&
    duckCenterY >= hitArea.y &&
    duckCenterY <= hitArea.y + hitArea.h;

  if (acertou) {
    score += 1;
    duck.alive = false;

    // Feedback visual (splash vermelho)
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(duckCenterX, duckCenterY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Respawn 
    setTimeout(resetDuck, 1000);

  }
});

gameLoop();

