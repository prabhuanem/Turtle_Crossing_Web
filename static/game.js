const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// Player (Turtle)
let player = { x: 290, y: 550, width: 20, height: 20 };

// Car Manager
let cars = [];
const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
let carSpeed = 2;  // Initial car speed
let level = 1;
let gameOver = false;
let frameCount = 0; // Frame counter to control car creation

// Function to create random cars with controlled frequency
function createCar() {
    // Only try to spawn a car every 30 frames (adjust as needed)
    if (frameCount % 30 === 0) {
        let maxAttempts = 50;  // Avoid infinite loops
        let attempt = 0;
        let spawnedCar = false;

        while (attempt < maxAttempts && !spawnedCar) {
            attempt++;
            let randomY = Math.floor(Math.random() * (canvas.height - 40));
            let safeSpawn = true;

            // Ensure a minimum gap between cars to avoid overcrowding
            for (let car of cars) {
                if (Math.abs(car.y - randomY) < 50) {
                    safeSpawn = false;
                    break;
                }
            }

            if (safeSpawn) {
                // Spawn the car
                let newCar = {
                    x: 700,  // Start slightly off-screen
                    y: randomY,
                    width: 40,
                    height: 20,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                cars.push(newCar);
                spawnedCar = true;  // Break out of the loop
            }
        }
        // If we never found a safe spawn, we simply skip spawning this frame.
    }
}

// Move cars to the left
function moveCars() {
    cars.forEach(car => car.x -= carSpeed);
    cars = cars.filter(car => car.x > -40); // Remove cars that move off-screen
}

// Detect collision between player and cars
function checkCollision() {
    cars.forEach(car => {
        if (
            player.x < car.x + car.width &&
            player.x + player.width > car.x &&
            player.y < car.y + car.height &&
            player.y + player.height > car.y
        ) {
            gameOver = true;
        }
    });
}

// Check if player reached the top (win condition)
function checkLevelUp() {
    if (player.y <= 0) {
        level += 1;
        carSpeed += 0.5;  // Increase speed each level
        player.y = 550;   // Reset player to starting position
    }
}

// Update game logic
function update() {
    if (!gameOver) {
        frameCount++;  // Increment frame count to control car creation
        moveCars();
        checkCollision();
        checkLevelUp();
        createCar();
    }
}

// Draw player as a "Turtle" (circle)
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 12, 0, Math.PI * 2);
    ctx.fillStyle = "green";  // Turtle color
    ctx.fill();
    ctx.closePath();
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game boundary
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawPlayer();

    // Draw cars
    cars.forEach(car => {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);
    });

    // Draw Scoreboard
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Level: " + level, 20, 30);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER!", canvas.width / 2 - 80, canvas.height / 2);
    }
}

// Player movement (Up Arrow Key)
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && player.y > 0) {
        player.y -= 20;
    }
});

// Main game loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
