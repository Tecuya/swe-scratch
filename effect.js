// Simple bouncing ball effect

// Get the canvas and context
const canvas = document.getElementById('effectCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 30,
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
function createBall(x, y) {
  return {
    x,
    y,
    size: 30,
    dx: (Math.random() - 0.5) * 10,
    dy: (Math.random() - 0.5) * 10
  };
}

// Add event listeners to canvas for mouse down and up events
let mouseDown = false;
let intervalId;

canvas.addEventListener('mousedown', function(event) {
  mouseDown = true;
  const rect = canvas.getBoundingClientRect();
  const create = (x, y) => {
    balls.push(createBall(x, y));
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

// Start the animation
// let gravity = false;
// const gravityToggle = document.getElementById('gravityToggle');
// gravityToggle.addEventListener('click', () => {
//   gravity = !gravity;
// });

// New gravity slider logic
let gravity = 0.5; // Default gravity value
const gravitySlider = document.getElementById('gravitySlider');
gravitySlider.addEventListener('input', () => {
  gravity = parseFloat(gravitySlider.value);
});

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

        // Exchange normal velocity components (tangent components remain unchanged)
        balls[i].dx = tangent.x * v1t + normal.x * v2n;
        balls[i].dy = tangent.y * v1t + normal.y * v2n;
        balls[j].dx = tangent.x * v2t + normal.x * v1n;
        balls[j].dy = tangent.y * v2t + normal.y * v1n;
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkCollisions(); // Check for collisions between balls
  drawBalls();

  balls.forEach(ball => {
    // Bounce off the walls
    // Damping factor for energy loss on wall collision
    const damping = 0.97;
    // Bounce off the walls with energy loss
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1 * damping;
    }
        if(ball.y + ball.size > canvas.height) {
            ball.dy *= -1 * damping;
            ball.y = canvas.height - ball.size; // Keep the ball within the canvas bounds
        }
        if(ball.y - ball.size < 0) {
            ball.dy *= -1 * damping;
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
    if (distance < explodedBall.size * 3) { // Arbitrary range of effect
      ball.dx += dx / distance * 5; // Arbitrary force of explosion
      ball.dy += dy / distance * 5;
    }
  });
}
