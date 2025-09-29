const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');

const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let isPlaying = false;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize))
    };
}

function draw() {
    // Bersihkan canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Gambar ular
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Gambar makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (!isPlaying) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Deteksi tabrakan dengan makanan
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Skor: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    // Deteksi tabrakan dengan dinding atau diri sendiri
    if (head.x < 0 || head.x >= canvasSize / gridSize ||
        head.y < 0 || head.y >= canvasSize / gridSize ||
        checkCollisionWithSelf()) {
        endGame();
        return;
    }

    draw();
}

function checkCollisionWithSelf() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function handleKeyDown(event) {
    const key = event.key;
    if (key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
    if (key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
    if (key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
    if (key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
    
    if (key === ' ' && !isPlaying) {
        startGame();
    }
}

function startGame() {
    isPlaying = true;
    score = 0;
    scoreElement.textContent = `Skor: ${score}`;
    messageElement.textContent = '';
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    generateFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 100);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameLoop);
    messageElement.textContent = `Game Over! Skor akhir: ${score}. Tekan spasi untuk main lagi.`;
}

document.addEventListener('keydown', handleKeyDown);

// Inisialisasi awal
generateFood();
draw();
