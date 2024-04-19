// Mock the balls array and document object
const balls = [];
const document = {
  getElementById: function(id) {
    return {
      innerText: '',
      value: '10'
    };
  }
};

// Mock the calculateKineticEnergy function from effect.js
function calculateKineticEnergy(ball) {
  if (typeof ball.dx !== 'number' || isNaN(ball.dx) || typeof ball.dy !== 'number' || isNaN(ball.dy)) {
    return 0;
  }
  const velocity = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
  const kineticEnergy = 0.5 * ball.size * velocity * velocity;
  return kineticEnergy;
}

// Function to update the temperature display
function updateTemperatureDisplay() {
  const totalKineticEnergy = balls.reduce((total, ball) => total + calculateKineticEnergy(ball), 0);
  const averageKineticEnergy = balls.length > 0 ? totalKineticEnergy / balls.length : 0;
  document.getElementById('temperatureDisplay').innerText = averageKineticEnergy.toFixed(2);
}

// Simulate adding balls with random velocities and sizes
for (let i = 0; i < 100; i++) {
  const size = Math.floor(Math.random() * 20) + 5; // Random size between 5 and 25
  const dx = (Math.random() * 2 - 1) * 10; // Random dx velocity between -10 and 10
  const dy = (Math.random() * 2 - 1) * 10; // Random dy velocity between -10 and 10
  balls.push({ size, dx, dy });
}

// Update the temperature display
updateTemperatureDisplay();

// Output the temperature for verification
console.log('Temperature:', document.getElementById('temperatureDisplay').innerText);

// Check if the temperature is NaN
if (isNaN(parseFloat(document.getElementById('temperatureDisplay').innerText))) {
  console.error('Test failed: Temperature is NaN');
} else {
  console.log('Test passed: Temperature is a number');
}
