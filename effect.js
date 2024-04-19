// Simple bouncing ball effect

// Get the canvas and context
const canvas = document.getElementById('effectCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 30;

// Damping factor for energy loss on collision
let damping = 0.97;

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 15,
  dx: 5,
  dy: 4
};

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Start the animation
// Initialize an array to hold multiple balls
const balls = [ball];  // Start with the initial ball

// Function to create a new ball at click position
function createBall(x, y, size) {
  return {
    x,
    y,
    size,
    dx: 0,
    dy: 0,
  };
}

// Add event listeners to canvas for mouse down and up events
let mouseDown = false;
let intervalId;

canvas.addEventListener('mousedown', function(event) {
  mouseDown = true;
  const rect = canvas.getBoundingClientRect();
  const ballSizeSlider = document.getElementById('ballSizeSlider');
  const create = (x, y) => {
    const size = parseInt(ballSizeSlider.value);
    balls.push(createBall(x, y, size));
    document.getElementById('circleCounter').innerText = balls.length;
  };
  const onMouseMove = (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    create(x, y);
  };
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', function(event) {
    mouseDown = false;
    canvas.removeEventListener('mousemove', onMouseMove);
  });
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  create(x, y);
});


// Modify drawBall to draw all balls
function drawBalls() {
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  });
}

// New gravity slider logic
let gravity = 0.5; // Default gravity value
const gravitySlider = document.getElementById('gravitySlider');
gravitySlider.addEventListener('input', () => {
  gravity = parseFloat(gravitySlider.value);
});

// Function to calculate kinetic energy of a ball
function calculateKineticEnergy(ball) {
  // Ensure that ball.dx and ball.dy are valid numbers
  if (typeof ball.dx !== 'number' || isNaN(ball.dx) || typeof ball.dy !== 'number' || isNaN(ball.dy)) {
    return 0; // Return 0 kinetic energy if invalid values are detected
  }
  const velocity = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
  const kineticEnergy = 0.5 * ball.size * velocity * velocity;
  return kineticEnergy;
}

// Function to update the temperature display
function updateTemperatureDisplay() {
  const totalKineticEnergy = balls.reduce((total, ball) => total + calculateKineticEnergy(ball), 0)
  const averageKineticEnergy = balls.length > 0 ? totalKineticEnergy / balls.length : 0;
  document.getElementById('temperatureDisplay').innerText = averageKineticEnergy.toFixed(2);
}


function checkCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[j].x - balls[i].x;
      const dy = balls[j].y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < balls[i].size + balls[j].size) {
        // Calculate normal and tangent vectors
        const normal = { x: dx / distance, y: dy / distance };
        const tangent = { x: -normal.y, y: normal.x };

        // Resolve velocities into normal and tangent components
        const v1n = normal.x * balls[i].dx + normal.y * balls[i].dy;
        const v1t = tangent.x * balls[i].dx + tangent.y * balls[i].dy;
        const v2n = normal.x * balls[j].dx + normal.y * balls[j].dy;
        const v2t = tangent.x * balls[j].dx + tangent.y * balls[j].dy;

        // Calculate new normal velocities using the mass (size)
        const m1 = balls[i].size;
        const m2 = balls[j].size;
        const newV1n = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        const newV2n = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

        // Convert the scalar normal and tangent velocities into vectors
        balls[i].dx = (tangent.x * v1t + normal.x * newV1n);
        balls[i].dy = (tangent.y * v1t + normal.y * newV1n);
        balls[j].dx = (tangent.x * v2t + normal.x * newV2n);
        balls[j].dy = (tangent.y * v2t + normal.y * newV2n);
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateTemperatureDisplay();
  
  checkCollisions(); // Check for collisions between balls
  drawBalls();

  balls.forEach(ball => {  
    // Bounce off the walls with energy loss
    if(ball.x + ball.size > canvas.width) {
      ball.dx *= -1 * damping;
      ball.x = canvas.width - ball.size; // Adjust position to prevent bleeding
    }
    if(ball.x - ball.size < 0) {
      ball.dx *= -1 * damping;
      ball.x = ball.size; // Adjust position to prevent bleeding
    }
    if(ball.y + ball.size > canvas.height) {
      ball.dy *= -1 * damping;
      ball.y = canvas.height - ball.size; // Adjust position to prevent bleeding
    }
    if(ball.y - ball.size < 0) {
      ball.dy *= -1 * damping;
      ball.y = ball.size; // Adjust position to prevent bleeding
    }

    // Apply gravity from the slider
    ball.dy += gravity; // Use the gravity value from the slider

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;
  });

  requestAnimationFrame(update);
}

// Start the animation
update();
document.addEventListener('DOMContentLoaded', (event) => {
  const explodeButton = document.getElementById('explodeButton');
  explodeButton.addEventListener('click', explodeRandomBall);


});

function explodeRandomBall() {
  if (balls.length === 0) return; // No balls to explode
  const index = Math.floor(Math.random() * balls.length);
  const explodedBall = balls[index];
  balls.splice(index, 1); // Remove the exploded ball

  // Calculate the explosion effect on nearby balls
  balls.forEach(ball => {
    const dx = ball.x - explodedBall.x;
    const dy = ball.y - explodedBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < explodedBall.size * 8) { // Arbitrary range of effect
      ball.dx += dx / distance * 20; // Arbitrary force of explosion
      ball.dy += dy / distance * 20;
    }
  });
}


// Update the damping variable when the slider value changes
const dampingSlider = document.getElementById('dampingSlider')
dampingSlider.addEventListener('input', () => {
  damping = parseFloat(dampingSlider.value);
});
