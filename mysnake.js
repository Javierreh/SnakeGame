const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");

let size = 20;
let snake = [ { x: 180, y: 180 },
                { x: 160, y: 180 },
                { x: 140, y: 180 } ];

let food = getFoodPosition();

let dx = size;
let dy = 0;
let lastAxis;

let score = 0;
let moves = 0;
let prevScore = 0;
let prevMoves = 0;

let newGame = false;
let stoppedGame = false;

const startButton = document.getElementById("startButton");
const canvasSize = document.getElementById("canvasSize");
const gameDisplay = document.getElementById("gameDisplay");
const options = document.getElementById("options");

startButton.addEventListener("click", initGame);

setInterval(main, 100);

function main(){
  if (newGame) {
    draw();
    if (!stoppedGame) {
      update();
    }
  }
}

function initGame() {
  myCanvas.style.width = canvasSize.value;
  gameDisplay.style.display = "flex";
  startButton.style.display = "none";
  options.style.display = "none";
  newGame = true;
}

////////////////////////////////////////////////////////////////////////////////

function update() {
  // Comprueba al principio del update de las variables si da true ejecutar la comprobación de colisión
  // si devuelve true es que se cumple la condición y ejecuta el if con el gameOver,
  // sino hay colision, no ejecuta el gameOver, ejecuta el resto del update, siguiendo el juego.
  if (checkSnakeCollision()) {
    gameOver();
  }
  // Guardar la posicion ultima del cuerpo de la serpiente,
  // para más tarde si ha comido, usar esta posicion para añadir un nuevo elemento al cuerpo de la serpiente
  let prevPosition = {};
  prevPosition.x = snake[snake.length-1].x;
  prevPosition.y = snake[snake.length-1].y;

  // Dezplazar cada posicion en el array de la serpiente
  for (let i = snake.length-1; i >= 1; i--) {
    snake[i].x = snake[i-1].x;
    snake[i].y = snake[i-1].y;
  }

  // Actualizacion de la nueva posicion del primer indice(cabeza) de la serpiente (segun el diferencial de x o y (movimiento de teclas))
  snake[0].x += dx;
  snake[0].y += dy;

  // Comprobar si la posición de la cabeza excede los limites el canvas, para hacerla aparecer por el otro lado
  if (snake[0].x > 380) {
    snake[0].x = 0;
  } else if (snake[0].x < 0) {
    snake[0].x = 380;
  } else if (snake[0].y > 380) {
    snake[0].y = 0;
  } else if (snake[0].y < 0) {
    snake[0].y = 380;
  }

  // Guardar en que eje se movió por ultima vez la serpiente
  if (dx !== 0) {
    lastAxis = "X";
  } else if (dy !== 0) {
    lastAxis = "Y";
  }

  // Detectar si la serpiente ha consumido el alimento
  if (food && snake[0].x === food.x && snake[0].y === food.y) {
    // aumentar el tamaño de la serpiente
    increaseSnakeSize(prevPosition);
    // Aumentar puntuación y mostrar en pantalla
    plusScore();
    // Nueva posición para la comida
    food = getFoodPosition();
  }

}

////////////////////////////////////////////////////////////////////////////////

function draw() {
  if (!stoppedGame) {
    // Dibujar el fondo, del color deseado, y del tamaño del canvas
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    // Dibujar la serpiente
    snake.forEach(function(elem) {
      drawObject(elem, "green");
    });

    // Dibujar comida
    drawObject(food, "red");
  }

  // Dibujar Game Over
  if (stoppedGame) {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    myCanvas.style.letterSpacing = "5px";
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("G A M E", myCanvas.width/2 + 3, myCanvas.height/6);
    ctx.fillText("O V E R", myCanvas.width/2 + 3, myCanvas.height/3);

    ctx.font = "20px Arial";
    ctx.fillText("Score: " + prevScore, myCanvas.width/2, myCanvas.height/1.9);
    ctx.fillText("Moves: " + prevMoves, myCanvas.width/2, myCanvas.height/1.65);
    ctx.fillText("— Play again? —", myCanvas.width/2, myCanvas.height * 0.8);
    ctx.fillText("Press the space bar", myCanvas.width/2, myCanvas.height * 0.9);
  }

}

// Función que ejecuta el dibujo de cada objeto,
// que se ejecuta dentro de draw() cuando dibuja cada parte del cuerpo de la serpiente y la comida
function drawObject(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, size, size);
  ctx.strokeRect(obj.x, obj.y, size, size);
}

////////////////////////////////////////////////////////////////////////////////

// Generar posición X e Y para la comida
function getPositionX() {
  return parseInt(Math.random() * 20) * 20;
}

function getPositionY() {
  return parseInt(Math.random() * 20) * 20;
}

// Obtener unas coordenas válidas (Sin que choque con la serpiente)
function getFoodPosition() {
  let position;
  do {
    position = { x: getPositionX(), y: getPositionY() };
  } while (checkFoodCollision(position));
  return position;
}

// Comprobar si la posicion de la comida coincide con alguna del cuerpo de la serpiente
function checkFoodCollision(position) {
  for (let i = 0; i < snake.length; i++) {
    if (position.x === snake[i].x && position.y === snake[i].y) {
      return true;
    }
  }
}

// Comprobar si la cabeza de la serpiente ocupa la posicion de alguna parte de su cuerpo
function checkSnakeCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }
}

// Funcion para hacer crecer la serpiente
function increaseSnakeSize(prevPosition) {
  snake.push({
    x: prevPosition.x,
    y: prevPosition.y
  });
}

// Sumar puntuación y mostrarla
function plusScore() {
  score++;
  scoreDisplay.innerHTML = score;
}

// Sumar movimiento y mostrarlo
function plusMove() {
  moves++;
  movesDisplay.innerHTML = moves;
}

// Game Over, si esto ocurre se reinician las variables para empezar de nuevo todo
function gameOver() {
  snake = [ { x: 180, y: 180 },
            { x: 160, y: 180 },
            { x: 140, y: 180 } ];
  dx = size;
  dy = 0;
  food = getFoodPosition();
  prevScore = score;
  prevMoves = moves;
  score = 0;
  scoreDisplay.innerHTML = score;
  moves = 0;
  movesDisplay.innerHTML = moves;

  // Pone la variable general en true para dejar de ejecutar update()
  stoppedGame = true;
}

////////////////////////////////////////////////////////////////////////////////

// Listener que reconoce la pulsacion de teclas
document.addEventListener("keydown", moveSnake);

// Funcion para recoger hacia donde debe moverse la serpiente
function moveSnake(event) {
  switch (event.key) {
    case " ":
      stoppedGame = false;
      break;
    case "ArrowUp":
      if (lastAxis !== "Y" && stoppedGame === false) {
        dx = 0;
        dy = -size;
        plusMove();
      }
      break;
    case "ArrowDown":
      if (lastAxis !== "Y" && stoppedGame === false) {
        dx = 0;
        dy = +size;
        plusMove();
      }
      break;
    case "ArrowRight":
      if (lastAxis !== "X" && stoppedGame === false) {
        dx = +size;
        dy = 0;
        plusMove();
      }
      break;
    case "ArrowLeft":
      if (lastAxis !== "X" && stoppedGame === false) {
        dx = -size;
        dy = 0;
        plusMove();
      }
      break;
    default:
  }
}
