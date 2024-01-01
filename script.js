const gameWrapper = document.getElementById("game-wrapper");
const gameStart = document.getElementById("game-start");

const gameTime = document.getElementById("game-time");
const gameScore = document.getElementById("game-score");
const gameFail = document.getElementById("game-fail");
const gamePlayer = document.getElementById("game-user");

let intervalId;
let seconds = 0;
let minutes = 0;

gameWrapper.style.display = "none";

// Start Game
document.getElementById("start-game").addEventListener("click", function (e) {
  e.preventDefault();

  // Update Content
  gameWrapper.style.display = "flex";
  gameStart.style.display = "none";

  // Update name
  var playerName = document.getElementById("player-name").value;
  localStorage.setItem("player-name", playerName);
  gamePlayer.innerHTML = `Player Name : ${playerName}`;

  // Update Time
  const startTimer = () => {
    intervalId = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      updateTimerDisplay();
    }, 1000);
  };

  // Update Timer Function
  const updateTimerDisplay = () => {
    formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    gameTime.textContent = `Time : ${formattedTime}`;
  };

  startTimer();

  // Init Game
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 600;

  ctx.fillStyle = "#414141";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
