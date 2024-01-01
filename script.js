const gameWrapper = document.getElementById("game-wrapper");
const gameStart = document.getElementById("game-start");
const gamePause = document.getElementById("game-pause");
const gameOverlay = document.getElementById("game-overlay");
const gameOver = document.getElementById("game-over");

const gameTime = document.getElementById("game-time");
const gameScore = document.getElementById("game-score");
const gameFail = document.getElementById("game-fail");
const gamePlayer = document.getElementById("game-user");

const continueButton = document.getElementById("continue-button");
const restartButtonOver = document.getElementById("restart-button-game-over");
const restartBoardPause = document.getElementById("restart-button-game-pause");
const restartButtonBoard = document.getElementById("restart-button-game-board");
const quitButton = document.getElementById("quit-button");

// console.log(restartBoard);

let intervalId;
let seconds = 0;
let minutes = 0;

let canvas;
let ctx;

let score = 0;
let failCount = 0;
let virusInterval;
let virusGenerationInterval;
let viruses = [];

let isPaused = false;

let buttonSize;

const keyPosition = {
  D: 50,
  F: 150,
  J: 250,
  K: 350,
};

gameWrapper.style.display = "none";
gameOver.style.display = "none";
gamePause.style.display = "none";

// Start Game
document.getElementById("start-game").addEventListener("click", function (e) {
  e.preventDefault();

  gameWrapper.style.display = "flex";
  gameStart.style.display = "none";

  var playerName = document.getElementById("player-name").value;
  localStorage.setItem("player-name", playerName);
  gamePlayer.innerHTML = `Player Name : ${playerName ?? "NaN"}`;

  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 600;

  startTimer();

  // Start generating viruses
  virusGenerationInterval = setInterval(generateVirus, 2000); // Adjust the interval as needed
  intervalId = setInterval(gameLoop, 1000 / 60);
});

// Continue Game
continueButton.addEventListener("click", function (e) {
  e.preventDefault();
  togglePause();
});

// Reset Game
const resetGame = () => {
  gameOver.style.display = "none";
  gameOverlay.style.display = "none";

  console.log("restarted");
  seconds = 0;
  minutes = 0;
  score = 0;
  failCount = 0;
  viruses = [];

  // Clear Virus Interval
  clearInterval(virusInterval);

  virusInterval = setInterval(generateVirus, 2000);

  updateTimerDisplay();
  updateScore();
};

// Reset game
restartButtonOver.addEventListener("click", function (e) {
  e.preventDefault();
  resetGame();
});

// Reset game
restartButtonBoard.addEventListener("click", function (e) {
  e.preventDefault();
  resetGame();
});

// Reset game
restartBoardPause.addEventListener("click", function (e) {
  e.preventDefault();
  resetGame();
});

// Quit Game
quitButton.addEventListener("click", function (e) {
  e.preventDefault();
  quitGame();
});

// Pause game
const togglePause = () => {
  isPaused = !isPaused;

  // If paused, clear the interval
  if (isPaused) {
    clearInterval(intervalId);
    gamePause.style.display = "block";
    gameOverlay.style.display = "block";

    console.log("Game paused");
  } else {
    gamePause.style.display = "none";
    gameOverlay.style.display = "none";

    // Loop game for 1second by 60 fps
    intervalId = setInterval(gameLoop, 1000 / 60);
    console.log("Game resumed");
  }
};

// Quit Game
const quitGame = () => {
  localStorage.setItem("final-score", score);
  localStorage.setItem(
    "final-time",
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  );

  clearInterval(virusGenerationInterval);
  clearInterval(virusInterval);
  viruses = [];

  seconds = 0;
  minutes = 0;
  updateTimerDisplay();

  score = 0;
  updateScore();

  displayGameOver();
};

// Display game over
const displayGameOver = () => {
  gamePause.style.display = "none";
  gameOverlay.style.display = "block";
  gameOver.style.display = "block";

  const finalScore = localStorage.getItem("final-score") || 0;
  const finalTime = localStorage.getItem("final-time") || "00:00";
  const playerName = localStorage.getItem("player-name") || "NaN";

  document.getElementById("game-over-time").textContent = `Time: ${finalTime}`;
  document.getElementById(
    "game-over-score"
  ).textContent = `Score: ${finalScore}`;
  document.getElementById(
    "game-over-player"
  ).textContent = `Player: ${playerName}`;
};

// Detect keyboard key
document.addEventListener("keydown", function (event) {
  const key = event.key ? event.key.toUpperCase() : null;
  if (key) {
    console.log(key);

    // Toggle pause state when "Esc" key is pressed
    if (key === "ESCAPE") {
      togglePause();
    } else {
      handleUserInput(key);
    }
  }
});

// Start Timer
const startTimer = () => {
  intervalId = setInterval(() => {
    // Check if the game is not paused
    if (!isPaused) {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      updateTimerDisplay();
    }
  }, 1000);
};

// Update Timer Display
const updateTimerDisplay = () => {
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  gameTime.textContent = `Time : ${formattedTime}`;
};

// Generate Virus
const generateVirus = () => {
  const columnWidth = canvas.width / 4;
  const columnIndex = Math.floor(Math.random() * 4);

  const virus = new Image();
  virus.src = "images/coronavirus.png";

  const virusWidth = 50;
  const virusHeight = 50;

  viruses.push({
    image: virus,
    x: columnIndex * columnWidth + (columnWidth - virusWidth) / 2,
    y: 0,
    speed: 5,
    width: virusWidth,
    height: virusHeight,
  });
};

// Generate Virus Positions
const updateVirusPositions = () => {
  for (let i = 0; i < viruses.length; i++) {
    viruses[i].y += viruses[i].speed;

    // Handle Viruses via y-axis
    if (viruses[i].y > canvas.height) {
      failCount++;
      viruses.splice(i, 1);
      i--;
    }
  }
};

// Render Button
const renderButtons = () => {
  const buttonSize = canvas.width / 4;

  const buttonD = {
    x: (1 - 0.5) * (canvas.width / 4) - buttonSize / 2, // Centered in the first column
    y: canvas.height - buttonSize,
    width: buttonSize,
    height: buttonSize,
    key: "D",
    isShining: false,
  };

  const buttonF = {
    x: (2 - 0.5) * (canvas.width / 4) - buttonSize / 2, // Centered in the second column
    y: canvas.height - buttonSize,
    width: buttonSize,
    height: buttonSize,
    key: "F",
    isShining: false,
  };

  const buttonJ = {
    x: (3 - 0.5) * (canvas.width / 4) - buttonSize / 2, // Centered in the third column
    y: canvas.height - buttonSize,
    width: buttonSize,
    height: buttonSize,
    key: "J",
    isShining: false,
  };

  const buttonK = {
    x: (4 - 0.5) * (canvas.width / 4) - buttonSize / 2, // Centered in the fourth column
    y: canvas.height - buttonSize,
    width: buttonSize,
    height: buttonSize,
    key: "K",
    isShining: false,
  };

  // Store buttons for click detection
  const buttons = [buttonD, buttonF, buttonJ, buttonK];

  // Draw buttons
  buttons.forEach((button) => {
    const opacity = button.isShining ? 0.5 : 1.0;

    ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`;
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px Arial";
    ctx.fillText(
      button.key,
      button.x + button.width / 2 - 10,
      button.y + button.height / 2 + 10
    );
  });
};

// Handle button when pressed
const handleButtonClick = (buttonKey) => {
  console.log(buttonKey);
  const button = {
    x: (keyPosition[buttonKey] - 0.5) * (canvas.width / 4) - buttonSize / 2,
    y: canvas.height - buttonSize,
    width: buttonSize,
    height: buttonSize,
  };

  for (let i = 0; i < viruses.length; i++) {
    const virus = viruses[i];
    const hitX = virus.x <= button.x + button.width && button.x <= virus.x + 50;
    const hitY =
      virus.y <= canvas.height - 30 && canvas.height - 30 <= virus.y + 50;

    if (hitX && hitY) {
      score++;
      viruses.splice(i, 1);
    }
  }
};

// Render Virus by draw coronavirus.png
const renderViruses = () => {
  // Draw columns
  ctx.fillStyle = "#999999";
  for (let i = 1; i <= 3; i++) {
    const columnX = i * (canvas.width / 4);
    ctx.fillRect(columnX - 2, 0, 4, canvas.height);
  }

  // Draw viruses
  for (let i = 0; i < viruses.length; i++) {
    const virus = viruses[i];
    ctx.drawImage(virus.image, virus.x, virus.y, virus.width, virus.height);
  }

  // Draw buttons
  renderButtons();
};

// Handle keyboard user input
const handleUserInput = (key) => {
  for (let i = 0; i < viruses.length; i++) {
    const virus = viruses[i];
    const hitX =
      virus.x <= keyPosition[key] && keyPosition[key] <= virus.x + 50;
    const hitY =
      virus.y <= canvas.height - 75 && canvas.height - 75 <= virus.y + 50;

    if (hitX && hitY) {
      score++;
      viruses.splice(i, 1);
    }
  }
};

// Update Score
const updateScore = () => {
  gameScore.textContent = `Score : ${score}`;
  gameFail.textContent = `Fail : ${failCount}`;
};

// Main game function
const gameLoop = () => {
  if (!isPaused) {
    ctx.fillStyle = "#414141";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateVirusPositions();
    handleUserInput();
    updateScore();
    renderViruses();
  }
};
