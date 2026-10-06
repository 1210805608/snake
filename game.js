const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const statusElement = document.getElementById("gameStatus");
const pauseOverlay = document.getElementById("pauseOverlay");
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");

const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
const GAME_INTERVAL = 150;
const HIGH_SCORE_KEY = "snakeHighScore";

let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: -1 };
let nextDirection = { x: 0, y: -1 };
let score = 0;
let highScore = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10) || 0;
let gameRunning = false;
let isPaused = false;
let gameLoop = null;

function setStatus(message = "") { statusElement.textContent = message; }
function updateScore() { scoreElement.textContent = String(score); highScoreElement.textContent = String(highScore); }
function initGame() { snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]; direction = { x: 0, y: -1 }; nextDirection = { x: 0, y: -1 }; score = 0; setStatus(); spawnFood(); updateScore(); draw(); }
function spawnFood() { do { food = { x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) }; } while (snake.some((segment) => segment.x === food.x && segment.y === food.y)); }
function startGame() { if (gameRunning) return; initGame(); gameRunning = true; isPaused = false; pauseButton.disabled = false; pauseButton.textContent = "暂停"; pauseOverlay.hidden = true; clearInterval(gameLoop); gameLoop = setInterval(update, GAME_INTERVAL); }
function togglePause() { if (!gameRunning) return; isPaused = !isPaused; pauseOverlay.hidden = !isPaused; pauseButton.textContent = isPaused ? "继续" : "暂停"; }
function setDirection(x, y) { if (!gameRunning || isPaused) return; if (direction.x === -x && direction.y === -y) return; nextDirection = { x, y }; }
function update() { if (!gameRunning || isPaused) return; direction = { ...nextDirection }; const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }; const hitsWall = head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT; const hitsSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y); if (hitsWall || hitsSelf) { endGame(); return; } snake.unshift(head); if (head.x === food.x && head.y === food.y) { score += 10; if (score > highScore) { highScore = score; localStorage.setItem(HIGH_SCORE_KEY, String(highScore)); } spawnFood(); updateScore(); } else { snake.pop(); } draw(); }
function draw() { ctx.fillStyle = "#f0f0f0"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2); ctx.fill(); snake.forEach((segment, index) => { ctx.fillStyle = index === 0 ? "#3b82f6" : "#1d4ed8"; ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2); }); }
function endGame() { gameRunning = false; isPaused = false; clearInterval(gameLoop); gameLoop = null; pauseButton.disabled = true; pauseOverlay.hidden = true; setStatus("游戏结束！得分：" + score); }
document.addEventListener("keydown", (event) => { if (event.code === "Space") { event.preventDefault(); togglePause(); return; } const key = event.key.toLowerCase(); const directions = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }; const next = directions[key]; if (next) { event.preventDefault(); setDirection(...next); } });
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
updateScore();
initGame();