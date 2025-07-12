const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Configurações de jogo ---
const NUM_DUCKS = 3;
let ducks = [];
let score = 0;
let timeLeft = 30;
let gameRunning = true;

const duckSprite = new Image();
duckSprite.src = 'assets/duck.gif'; // caminho para o spritesheet do pato

const SPRITE_WIDTH = 64;   // ajuste conforme spritesheet
const SPRITE_HEIGHT = 64;
const FRAME_COUNT = 4;     // número de frames horizontais
let spriteFrame = 0;
let spriteTimer = 0;

// --- Sons ---
const shootSound = new Audio('assets/shoot.mp3');
const quackSound = new Audio('assets/quack.mp3');

// --- Geração de pato ---
function createDuck() {
  return {
    x: Math.random() * 700 + 50,
    y: Math.random() * 500 + 50,
    size: 50,
    dx: 2 + Math.random() * 2,
    dy: 2 + Math.random() * 2,
    alive: true,
  };
}

// --- Inicializa os patos ---
for (let i = 0; i < NUM_DUCKS; i++) {
  ducks.push(createDuck());
}

// --- Loop do jogo ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Área de mira
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);

  // Atualiza e desenha cada pato
  ducks.forEach((duck, index) => {
    if (!duck.alive) return;

    duck.x += duck.dx;
    duck.y += duck.dy;

    // Rebater nas bordas
    if (duck.x <= 0 || duck.x + duck.size >= canvas.width) duck.dx *= -1;
    if (duck.y <= 0 || duck.y + duck.size >= canvas.height) duck.dy *= -1;

    // Animação de sprite
    spriteTimer++;
    if (spriteTimer % 10 === 0) {
      spriteFrame = (spriteFrame + 1) % FRAME_COUNT;
    }

    // Desenha o pato
    ctx.drawImage(
      duckSprite,
      SPRITE_WIDTH * spriteFrame, 0,
      SPRITE_WIDTH, SPRITE_HEIGHT,
      duck.x, duck.y,
      duck.size, duck.size
    );

  });

  // Pontuação
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Pontos: ${score}`, 10, 30);

  // Tempo
  ctx.fillText(`Tempo: ${timeLeft}s`, canvas.width - 150, 30);

  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// --- Tiro recebido ---
socket.on('shotFired', () => {
  if (!gameRunning) return;

  shootSound.play();

  const hitArea = {
    x: canvas.width / 2 - 50,
    y: canvas.height / 2 - 50,
    w: 100,
    h: 100,
  };

  ducks.forEach((duck, index) => {
    if (!duck.alive) return;

    const cx = duck.x + duck.size / 2;
    const cy = duck.y + duck.size / 2;

    const acertou =
      cx >= hitArea.x &&
      cx <= hitArea.x + hitArea.w &&
      cy >= hitArea.y &&
      cy <= hitArea.y + hitArea.h;

    if (acertou) {
      duck.alive = false;
      score += 1;
      quackSound.play();

      // Splash vermelho
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      // Respawn do pato após 1s
      setTimeout(() => {
        ducks[index] = createDuck();
      }, 1000);
    }
  });
});

// --- Cronômetro arcade ---
setInterval(() => {
  if (!gameRunning) return;

  timeLeft--;
  if (timeLeft <= 0) {
    gameRunning = false;
    setTimeout(() => {
      alert(`⏱️ Fim de jogo!\nPontuação final: ${score} ponto(s)`);
      location.reload();
    }, 500);
  }
}, 1000);

// Inicia o loop
gameLoop();
