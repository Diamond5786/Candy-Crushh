const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fruits = ['🍎', '🍋', '🍒', '🍉', '🍇'];
const gridSize = 8;
const tileSize = 50;
let grid = [];
let score = 0;
let level = 1;
let selectedTile = null;

canvas.width = gridSize * tileSize;
canvas.height = gridSize * tileSize;

// Initialize grid
function initGrid() {
    grid = Array(gridSize).fill().map(() => 
        Array(gridSize).fill().map(() => fruits[Math.floor(Math.random() * fruits.length)])
    );
}

// Draw grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            ctx.fillStyle = '#f9f9f9';
            ctx.fillRect(col * tileSize, row * tileSize, tileSize - 2, tileSize - 2);
            ctx.font = '40px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(grid[row][col], col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
        }
    }
}

// Check for matches
function checkMatches() {
    let matches = [];
    // Horizontal matches
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize - 2; col++) {
            if (grid[row][col] === grid[row][col + 1] && grid[row][col] === grid[row][col + 2]) {
                matches.push([row, col], [row, col + 1], [row, col + 2]);
            }
        }
    }
    // Vertical matches
    for (let col = 0; col < gridSize; col++) {
        for (let row = 0; row < gridSize - 2; row++) {
            if (grid[row][col] === grid[row + 1][col] && grid[row][col] === grid[row + 2][col]) {
                matches.push([row, col], [row + 1][col], [row + 2][col]);
            }
        }
    }
    return matches;
}

// Remove matches and update score
function removeMatches(matches) {
    matches.forEach(([row, col]) => {
        grid[row][col] = null;
    });
    score += matches.length * 10;
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Fill empty spaces
function fillGrid() {
    for (let col = 0; col < gridSize; col++) {
        for (let row = gridSize - 1; row >= 0; row--) {
            if (grid[row][col] === null) {
                let aboveRow = row - 1;
                while (aboveRow >= 0 && grid[aboveRow][col] === null) {
                    aboveRow--;
                }
                if (aboveRow >= 0) {
                    grid[row][col] = grid[aboveRow][col];
                    grid[aboveRow][col] = null;
                } else {
                    grid[row][col] = fruits[Math.floor(Math.random() * fruits.length)];
                }
            }
        }
    }
}

// Check level progression
function checkLevel() {
    if (score >= level * 100) {
        level++;
        document.getElementById('level').textContent = `Level: ${level}`;
        document.getElementById('result').textContent = `Level ${level} Unlocked!`;
    }
}

// Handle tile click
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    if (selectedTile) {
        const [sRow, sCol] = selectedTile;
        if (Math.abs(sRow - row) + Math.abs(sCol - col) === 1) {
            // Swap tiles
            [grid[sRow][sCol], grid[row][col]] = [grid[row][col], grid[sRow][sCol]];
            drawGrid();
            const matches = checkMatches();
            if (matches.length > 0) {
                removeMatches(matches);
                fillGrid();
                drawGrid();
                checkLevel();
            } else {
                // Swap back if no matches
                [grid[sRow][sCol], grid[row][col]] = [grid[row][col], grid[sRow][sCol]];
                drawGrid();
            }
            selectedTile = null;
        } else {
            selectedTile = [row, col];
        }
    } else {
        selectedTile = [row, col];
    }
});

// Start game
document.getElementById('start-button').addEventListener('click', () => {
    initGrid();
    drawGrid();
    score = 0;
    level = 1;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('level').textContent = `Level: ${level}`;
    document.getElementById('result').textContent = 'Match 3 or more fruits!';
});

// Direct Link auto-open every 15 seconds
setInterval(() => {
    window.open('https://www.profitableratecpm.com/tyk1vhpgq8?key=800355cffac012839bfd81f06844af89', '_blank');
}, 15000);

// Initial draw
initGrid();
drawGrid();
