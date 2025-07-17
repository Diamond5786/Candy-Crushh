const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set dynamic canvas size based on screen width
function setCanvasSize() {
  const containerWidth = document.querySelector(".game-container").offsetWidth;
  canvas.width = containerWidth;
  canvas.height = containerWidth; // Square canvas
  gridSize = Math.floor(containerWidth / candySize);
}

window.addEventListener("resize", setCanvasSize);

setCanvasSize();

const gridSize = 8;
let score = 0;
let level = 1;
let grid = [];

const candyColors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#1abc9c"];

// Initialize game
function initGame() {
  grid = createGrid();
  updateScore();
  updateLevel();
  drawGrid();
}

// Create random grid
function createGrid() {
  const grid = [];
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = getRandomCandy();
    }
  }
  return grid;
}

function getRandomCandy() {
  return candyColors[Math.floor(Math.random() * candyColors.length)];
}

// Draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const candySize = canvas.width / gridSize;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      ctx.fillStyle = grid[row][col];
      ctx.fillRect(col * candySize, row * candySize, candySize, candySize);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(col * candySize, row * candySize, candySize, candySize);
    }
  }
}

// Handle click
canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const clickedCol = Math.floor(x / (canvas.width / gridSize));
  const clickedRow = Math.floor(y / (canvas.height / gridSize));

  if (clickedRow >= 0 && clickedRow < gridSize && clickedCol >= 0 && clickedCol < gridSize) {
    alert("You clicked on row: " + clickedRow + ", col: " + clickedCol);
  }
});

// Update score
function updateScore() {
  document.getElementById("score").textContent = score;
}

// Update level
function updateLevel() {
  document.getElementById("level").textContent = level;
}

// Restart game
function restartGame() {
  score = 0;
  level = 1;
  updateScore();
  updateLevel();
  initGame();
}

// Start game
initGame();
