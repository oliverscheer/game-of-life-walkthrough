/**
 * Main game loop that continuously updates and redraws the grid.
 * It uses a timeout to control the speed of the game.
 */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 5;
const cellRadius = 1;
const TIMEOUT = 5;
let rows, cols;
let grid, nextGrid;

// Initialize the canvas and start the game loop
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
gameLoop();

/**
 * Resize the canvas and initialize the grids
 */
function resizeCanvas() {
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;
    rows = Math.floor(canvas.height / cellSize);
    cols = Math.floor(canvas.width / cellSize);
    grid = createGrid(rows, cols);
    nextGrid = createGrid(rows, cols);
    randomizeGrid();
}

/**
 * Create a 2D grid with the given dimensions
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @returns {Array} - 2D array representing the grid
 */
function createGrid(rows, cols) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

/**
 * Randomly populate the grid with live cells
 */
function randomizeGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col] = Math.random() > 0.8 ? 1 : 0;
        }
    }
}

/**
 * Draw the grid on the canvas
 */
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col]) {
                ctx.fillStyle = getCellColor(countNeighbors(row, col));
                ctx.beginPath();
                ctx.arc(
                    col * cellSize + cellSize / 2,
                    row * cellSize + cellSize / 2,
                    cellSize / 2 - cellRadius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
}

/**
 * Get the color of a cell based on the number of neighbors
 * @param {number} neighbors - Number of neighboring live cells
 * @returns {string} - Color of the cell
 */
function getCellColor(neighbors) {
    switch (neighbors) {
        case 0:
        case 1:
            return '#9be9a8';
        case 2:
        case 3:
            return '#40c463';
        case 4:
        case 5:
            return '#30a14e';
        default:
            return '#216e39';
    }
}

/**
 * Update the grid based on the rules of the game
 */
function updateGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(row, col);
            if (grid[row][col] === 1) {
                nextGrid[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
            } else {
                nextGrid[row][col] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    [grid, nextGrid] = [nextGrid, grid];
}

/**
 * Counts the number of live neighbors around a given cell in a grid.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {number} The number of live neighbors around the cell.
 *
 * This function iterates through the 8 neighboring cells around the given cell
 * (excluding the cell itself) and counts how many of them are alive. The grid
 * is assumed to be toroidal, meaning the edges wrap around (i.e., the grid is
 * connected at the edges like a torus).
 */
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x = (col + j + cols) % cols;
            const y = (row + i + rows) % rows;
            count += grid[y][x];
        }
    }
    return count;
}

/**
 * Main game loop
 */
function gameLoop() {
    drawGrid();
    updateGrid();
    setTimeout(gameLoop, TIMEOUT);
}
