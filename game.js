const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const customizeButton = document.getElementById('customize-button');
const customizePanel = document.getElementById('customize-panel');
const applyCustomize = document.getElementById('apply-customize');
const closeCustomize = document.getElementById('close-customize');
const gameNameInput = document.getElementById('game-name-input');
const bgColorInput = document.getElementById('bg-color-input');
const buttonColorInput = document.getElementById('button-color-input');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const movesDisplay = document.getElementById('moves');
const gameTitle = document.getElementById('game-title');

const GRID_SIZE = 8;
const TILE_SIZE = 50;
const FRUIT_TYPES = ['apple', 'banana', 'orange', 'grape', 'mango'];
const LEVELS = [
    { moves: 20, targetScore: 500 },
    { moves: 15, targetScore: 1000 },
    { moves: 10, targetScore: 1500 }
];

const FRUIT_COLORS = {
    apple: 'red',
    banana: 'yellow',
    orange: '#ff8c00',
    grape: 'purple',
    mango: '#ffa500'
};

canvas.width = GRID_SIZE * TILE_SIZE;
canvas.height = GRID_SIZE * TILE_SIZE;

let board = [];
let score = 0;
let level = 1;
let moves = LEVELS[0].moves;
let selectedTile = null;
let gameActive = false;

function initBoard() {
    board = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            board[i][j] = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        }
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.fillStyle = FRUIT_COLORS[board[i][j]];
            ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
        }
    }
}

function checkMatches() {
    let matches = [];
    // Check horizontal matches
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 2; j++) {
            if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
                matches.push({ row: i, col: j, length: 3, horizontal: true });
            }
        }
    }
    // Check vertical matches
    for (let j = 0; j < GRID_SIZE; j++) {
        for (let i = 0; i < GRID_SIZE - 2; i++) {
            if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
                matches.push({ row: i, col: j, length: 3, horizontal: false });
            }
        }
    }
    return matches;
}

function removeMatches(matches) {
    matches.forEach(match => {
        if (match.horizontal) {
            for (let i = 0; i < match.length; i++) {
                board[match.row][match.col + i] = null;
            }
        } else {
            for (let i = 0; i < match.length; i++) {
                board[match.row + i][match.col] = null;
            }
        }
        score += match.length * 10;
    });
    scoreDisplay.textContent = score;
}

function dropFruits() {
    for (let j = 0; j < GRID_SIZE; j++) {
        let emptySpaces = 0;
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
            if (board[i][j] === null) {
                emptySpaces++;
            } else if (emptySpaces > 0) {
                board[i + emptySpaces][j] = board[i][j];
                board[i][j] = null;
            }
        }
        for (let i = 0; i < emptySpaces; i++) {
            board[i][j] = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];
        }
    }
}

function swapTiles(tile1, tile2) {
    const temp = board[tile1.row][tile1.col];
    board[tile1.row][tile1.col] = board[tile2.row][tile2.col];
    board[tile2.row][tile2.col] = temp;
}

function isValidMove(tile1, tile2) {
    if (Math.abs(tile1.row - tile2.row) + Math.abs(tile1.col - tile2.col) !== 1) return false;
    swapTiles(tile1, tile2);
    const matches = checkMatches();
    swapTiles(tile1, tile2);
    return matches.length > 0;
}

function checkLevelProgress() {
    if (score >= LEVELS[level - 1].targetScore && level < LEVELS.length) {
        level++;
        moves = LEVELS[level - 1].moves;
        levelDisplay.textContent = level;
        movesDisplay.textContent = moves;
        initBoard();
    } else if (moves <= 0) {
        alert('Game Over! Final Score: ' + score);
        gameActive = false;
        startButton.textContent = 'Start Game';
        restartButton.style.display = 'inline-block';
    }
}

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const row = Math.floor(y / TILE_SIZE);
    const col = Math.floor(x / TILE_SIZE);
    
    if (selectedTile) {
        const newTile = { row, col };
        if (isValidMove(selectedTile, newTile)) {
            swapTiles(selectedTile, newTile);
            moves--;
            movesDisplay.textContent = moves;
            let matches = checkMatches();
            while (matches.length > 0) {
                removeMatches(matches);
                dropFruits();
                matches = checkMatches();
            }
            checkLevelProgress();
            drawBoard();
            selectedTile = null;
        } else {
            selectedTile = null;
        }
    } else {
        selectedTile = { row, col };
    }
});

function restartGame() {
    score = 0;
    level = 1;
    moves = LEVELS[0].moves;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    movesDisplay.textContent = moves;
    gameActive = true;
    startButton.textContent = 'Start Game';
    restartButton.style.display = 'inline-block';
    initBoard();
    drawBoard();
}

startButton.addEventListener('click', () => {
    gameActive = true;
    score = 0;
    level = 1;
    moves = LEVELS[0].moves;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    movesDisplay.textContent = moves;
    startButton.textContent = 'Start Game';
    restartButton.style.display = 'inline-block';
    initBoard();
    drawBoard();
});

restartButton.addEventListener('click', restartGame);

customizeButton.addEventListener('click', () => {
    customizePanel.style.display = 'block';
});

applyCustomize.addEventListener('click', () => {
    gameTitle.textContent = gameNameInput.value || 'Fruit Match';
    document.body.style.backgroundColor = bgColorInput.value;
    document.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = buttonColorInput.value;
    });
});

closeCustomize.addEventListener('click', () => {
    customizePanel.style.display = 'none';
});

// Redirection every 15 seconds to Adsterra link
setInterval(() => {
    window.open('https://www.profitableratecpm.com/tyk1vhpgq8?key=800355cffac012839bfd81f06844af89', '_blank');
}, 15000);

window.onload = () => {
    initBoard();
    drawBoard();
};
