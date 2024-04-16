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

// Add event listener to canvas for click events
canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  balls.push(createBall(x, y));
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
let gravity = false;
const gravityToggle = document.getElementById('gravityToggle');
gravityToggle.addEventListener('click', () => {
  gravity = !gravity;
});

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBalls();

  balls.forEach(ball => {
    // Bounce off the walls
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
      ball.dx *= -1;
    }
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }

    // Apply gravity if enabled
    if (gravity) {
      ball.dy += 0.5; // gravity acceleration value
    }

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;
  });

  requestAnimationFrame(update);
}

// Start the animation
update();
