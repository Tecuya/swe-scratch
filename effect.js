// Simple bouncing ball effect

// Get the canvas and context
const canvas = document.getElementById('effectCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 30;

// Damping factor for energy loss on collision
let damping = 0.97;
const dampingSlider = document.getElementById('dampingSlider');
dampingSlider.addEventListener('input', () => {
  damping = parseFloat(dampingSlider.value);
});

// New gravity slider logic
let gravity = 0.5; // Default gravity value
const gravitySlider = document.getElementById('gravitySlider');
gravitySlider.addEventListener('input', () => {
  gravity = parseFloat(gravitySlider.value);
});

const gravityZero = document.getElementById('gravityZero');
gravityZero.addEventListener('click', () => {
  gravitySlider.value = 0;
  gravity = 0;
});

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 15,
  dx: 5,
  dy: 4
};

// Initialize an array to hold multiple balls
const balls = [];

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

const tool = {
  applied: false,
  x: undefined,
  y: undefined
};

canvas.addEventListener('mouseup', function(event) {
  tool.applied = false;
});

canvas.addEventListener('mousedown', function(event) {
  tool.applied = true;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  tool.x = e.clientX - rect.left;
  tool.y = e.clientY - rect.top;
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

// Function to explode balls around a point
function explodeBalls(centerX, centerY) {
  const explosionRadius = 300; // radius within which balls will be affected
  const explosionForce = 5; // force of the explosion

  balls.forEach(ball => {
    const dx = ball.x - centerX;
    const dy = ball.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < explosionRadius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      ball.dx += explosionForce * forceDirectionX;
      ball.dy += explosionForce * forceDirectionY;
    }
  });
}

function implodeBalls(centerX, centerY) {
  const implosionRadius = 300; // radius within which balls will be affected
  const implosionForce = -5; // force of the implosion, negative to pull inward

  balls.forEach(ball => {
    const dx = ball.x - centerX;
    const dy = ball.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < implosionRadius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      ball.dx += implosionForce * forceDirectionX;
      ball.dy += implosionForce * forceDirectionY;
    }
  });
}

function applyToolEffect() {
  if(!tool.applied) {
    return;
  }
  const toolSelect = document.getElementById('toolSelect').value;
  if (toolSelect === 'addBall') {
    const ballSizeSlider = document.getElementById('ballSizeSlider');
    const size = parseInt(ballSizeSlider.value);
    balls.push(createBall(tool.x, tool.y, size));
    document.getElementById('circleCounter').innerText = balls.length;
  }else if (toolSelect === 'explodeBall') {
    explodeBalls(tool.x, tool.y);
  } else if (toolSelect === 'implodeBall') {
    implodeBalls(tool.x, tool.y);
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateTemperatureDisplay();

  checkCollisions(); // Check for collisions between balls

  applyToolEffect();

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
