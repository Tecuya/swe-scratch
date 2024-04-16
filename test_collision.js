// Test script for collision detection and response
const balls = [
  { x: 100, y: 100, size: 30, dx: 5, dy: 0 },
  { x: 200, y: 100, size: 30, dx: -5, dy: 0 }
];

function logBall(ball, index) {
  console.log(`Ball ${index}: x=${ball.x}, y=${ball.y}, dx=${ball.dx}, dy=${ball.dy}`);
}

// Simulate a few update cycles
for (let frame = 0; frame < 5; frame++) {
  console.log(`Frame ${frame}:`);
  balls.forEach(logBall);
  // Call the update function from effect.js
  // Note: This is a placeholder, as we cannot actually call the function in this test environment
  // update();
  // Instead, we'll simulate the update logic here
  balls.forEach(ball => {
    // Simulate wall collision response
    if (ball.x + ball.size > 300 || ball.x - ball.size < 0) {
      ball.dx *= -1;
    }
    if (ball.y + ball.size > 300 || ball.y - ball.size < 0) {
      ball.dy *= -1;
    }
    // Simulate ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;
  });
  // Simulate ball-to-ball collision response
  // This is a simplified version of the logic in effect.js
  const dx = balls[1].x - balls[0].x;
  const dy = balls[1].y - balls[0].y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < balls[0].size + balls[1].size) {
    balls[0].dx *= -1;
    balls[1].dx *= -1;
  }
}
