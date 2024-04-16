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

// Update ball position and handle bouncing
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Bounce off the walls
  if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Move the ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(update);
}

// Start the animation
update();
