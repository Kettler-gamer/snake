const playfield = document.querySelector(".playfield");
const snakeParts = [];
const scoreText = document.querySelector("#score");
const snakeStartBlock = document.querySelector("#\\35 -9");
const appleStartBlock = document.querySelector("#\\35 -3");

const startSnake = document.createElement("div");
startSnake.className = "snakePart";
startSnake.style =
  "border-top-left-radius: 50%; border-top-right-radius: 50%; transform: rotateZ(-90deg)";
snakeStartBlock.append(startSnake);
snakeParts.push(startSnake);

const startApple = document.createElement("div");
startApple.className = "apple";
appleStartBlock.append(startApple);

let direction = "ArrowLeft";
let gameStarted = false,
  gameOver = false,
  moveSet = false;
let interval = 500,
  score = 0;
const intervalDecrese = 5;

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    moveSnake();
  } else {
    snakeParts.splice(1, snakeParts.length - 1);
    for (let i = 0; i < playfield.children.length; i++) {
      const element = playfield.children[i];
      if (element.children.length > 0) {
        element.firstChild.remove();
      }
    }
    direction = "ArrowLeft";
    snakeStartBlock.append(snakeParts[0]);
    const apple = document.createElement("div");
    apple.className = "apple";

    appleStartBlock.append(apple);
    score = 0;
    scoreText.textContent = score;

    interval = 500;
    if (gameOver) {
      gameOver = false;
      gameStarted = false;
      startGame();
    }
  }
}

function moveSnake() {
  const currentBlock = snakeParts[0].parentElement.id.split("-");
  currentBlock[0] = Number(currentBlock[0]);
  currentBlock[1] = Number(currentBlock[1]);

  switch (direction) {
    case "ArrowLeft":
      currentBlock[1]--;
      snakeParts[0].style.transform = "rotateZ(-90deg)";
      break;
    case "ArrowRight":
      currentBlock[1]++;
      snakeParts[0].style.transform = "rotateZ(90deg)";
      break;
    case "ArrowUp":
      currentBlock[0]--;
      snakeParts[0].style.transform = "rotateZ(0deg)";
      break;
    case "ArrowDown":
      currentBlock[0]++;
      snakeParts[0].style.transform = "rotateZ(180deg)";
      break;
  }

  checkNumbers(currentBlock);

  let coord = currentBlock.join("-");
  if (coord.startsWith("10")) {
    coord = coord.replace("10", "1 0");
  }

  const nextBlock = document.querySelector("#\\3" + coord);

  if (nextBlock.children.length > 0) {
    const childElement = nextBlock.children[0];
    if (childElement.className === "apple") {
      childElement.remove();
      const newSnakePart = document.createElement("div");
      newSnakePart.className = "snakePart";
      nextBlock.append(newSnakePart);
      newSnakePart.style = snakeParts[0].style.cssText;
      snakeParts[0].style = "";
      snakeParts.unshift(newSnakePart);
      setTimeout(moveSnake, interval);
      spawnNewApple();
    } else {
      console.log("GAME OVER!");
      gameOver = true;
    }
  } else {
    moveRestOfSnakeParts(snakeParts[0].parentElement.id);
    nextBlock.append(snakeParts[0]);
    setTimeout(moveSnake, interval);
  }
  moveSet = false;
}

function spawnNewApple() {
  let appleSpawned = false;
  while (!appleSpawned) {
    const y = Math.ceil(Math.random() * 9);
    const x = Math.ceil(Math.random() * 9);

    if (x === 10) x = "1 0";
    if (y === 10) y = "1 0";

    const element = document.querySelector("#\\3" + y + "-" + x);

    if (element.children.length === 0) {
      const apple = document.createElement("div");
      apple.className = "apple";

      element.append(apple);
      appleSpawned = true;
    }
    score += 10;
    scoreText.textContent = score;
    interval -= intervalDecrese;
  }
}

function moveRestOfSnakeParts(curr) {
  let newPos = curr;

  for (let i = 1; i < snakeParts.length; i++) {
    const element = snakeParts[i];

    let coord = newPos;
    if (coord.startsWith("10")) {
      coord = coord.replace("10", "1 0");
    }

    const nextBlock = document.querySelector("#\\3" + coord);

    newPos = element.parentElement.id;

    nextBlock.append(snakeParts[i]);
  }
}

function checkNumbers(arr) {
  if (arr[0] > 10) {
    arr[0] = 1;
  }
  if (arr[0] < 1) {
    arr[0] = 10;
  }
  if (arr[1] > 10) {
    arr[1] = 1;
  }
  if (arr[1] < 1) {
    arr[1] = 10;
  }
}

function keyPress(event) {
  if (moveSet) return;
  moveSet = true;
  const key = event.key;
  if (key.startsWith("Arrow")) {
    switch (true) {
      case key === "ArrowUp" && direction === "ArrowDown":
        return;
      case key === "ArrowDown" && direction === "ArrowUp":
        return;
      case key === "ArrowLeft" && direction === "ArrowRight":
        return;
      case key === "ArrowRight" && direction === "ArrowLeft":
        return;
    }
    direction = key;
  }
}
