document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const levelDisplay = document.querySelector('#level');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let gameEnded = false;
    let score = 0;
    let queueIndex = null;
    let holdUsed = false;
    const colors = [
        'royalblue',
        'orange',
        'lawngreen',
        'red',
        'mediumorchid',
        'gold',
        'turquoise'
    ]
    const alpha = 1; //opacity of borders
    const bColors = [
        'hsl(227, 70%, 63%)', //royalblue
        'hsl(39, 95%, 50%)', //orange
        'hsl(90, 90%, 49%)', //lawngreen
        'hsl(0, 90%, 50%)', //red
        'hsl(288, 39%, 58%)', //mediumorchid
        'hsl(51, 95%, 50%)', //gold
        'hsl(168, 79%, 60%)' //turquoise
    ]
  
    //Tetrominoes
    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
  
    const lTetromino = [
        [0, 1, width+1, width*2+1],
        [width*2, width*2+1, width*2+2, width+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width+1, width+2, width*2]
    ];
  
    const sTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ];
  
    const zTetromino = [
        [width, width+1, width*2+1, width*2+2],
        [1, width+1, width, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width+1, width, width*2]
    ];
  
    const tTetromino = [
        [width, width+1, width+2, 1],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width+1, width*2+1, width]
    ];
  
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
  
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];
  
    const theTetrominoes = [jTetromino, lTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  
    let currentPosition = 4;
    let currentRotation = 0;
    //randomly choose a tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //initilise speed and level
    let speed = 1;
    let level = 1;
    let totalRowCount = 0;

    //allow movement when tetromino reaches a taken square (or the bottom)
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
          document.addEventListener('keyup', control);
        }
        while (currentDate - date < milliseconds);
    };
  
    //draw the current tetromino;
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
            squares[currentPosition + index].style.borderColor = bColors[random];
      });
    }
  
    //undraw the current tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
            squares[currentPosition + index].style.borderColor = '';
      });
    }
  
    //assign function to key codes
    function control(e) {
        if (timerId) {
            if (e.keyCode === 37) {
                moveLeft();
            } else if (e.keyCode === 38) {
                rotate();
            } else if (e.keyCode === 39) {
                moveRight();
            } else if (e.keyCode === 40) {
                moveDown();
                score += 1;
            } else if (e.keyCode === 67) {
                holdQueue();
            }
        }
    }
  
    document.addEventListener('keyup', control);
  
    //moveDown function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
  
    //stop when the tetromino reaches a taken square (or the bottom)
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            holdUsed = false;
            //start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            //slightly reduces the chance of some shape again
            if (nextRandom === random) {
                nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            }
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayShape();
            gameOver();
        };
    }
  
    //move the tetromino left, unless at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        //move left if not at edge
        if ( ! isAtLeftEdge) {
            currentPosition -= 1;
        };
        //undo this move if there is a blockage
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        };
        draw();
    }
  
    //move the tetromino right, unless at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        //move right if not at edge
        if ( ! isAtRightEdge) {
            currentPosition += 1;
        };
        //undo this move if there is a blockage
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        };
        draw();
    }
  
    //rotate the tetromino
    function rotate() {
        undraw();
        currentRotation += 1;
        currentRotation %= current.length;
        current = theTetrominoes[random][currentRotation];
        if (current.some(index => (currentPosition + index) % width === 0) && current.some(index => (currentPosition + index) % width === width - 1)) {
            currentRotation -= 1;
            currentRotation %= current.length;
        };
        //undo this move if there is a blockage
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentRotation -= 1;
            currentRotation %= current.length;
        };
        draw();
    }
  
    //show next up tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const holdSquares = document.querySelectorAll('.hold-grid div');
  
    //first rotaion of each tetromino
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //j
        [0, 1, displayWidth+1, displayWidth*2+1], //l
        [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2], //s
        [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //z
        [displayWidth, displayWidth+1, displayWidth+2, 1], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ];
  
    //display the shape in the mini-grid
    function displayShape() {
        //clear the mini-grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
            square.style.borderColor = '';
        });
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
            displaySquares[displayIndex + index].style.borderColor = bColors[nextRandom];
        });
    }

    //display the queued shape in the hold-grid
    function displayHoldShape() {
        //clear the hold-grid
        holdSquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
            square.style.borderColor = '';
        });
        if (queueIndex != null) {
            upNextTetrominoes[queueIndex].forEach( index => {
                holdSquares[displayIndex + index].classList.add('tetromino');
                holdSquares[displayIndex + index].style.backgroundColor = colors[queueIndex];
                holdSquares[displayIndex + index].style.borderColor = bColors[queueIndex];
            });
        }
    }

    //add current piece to  hold queue
    function holdQueue() {
        if (holdUsed == false) {
            holdUsed = true;
            if (queueIndex == null) {
                //queue current tetromino and get next up tetromino
                undraw();
                queueIndex = random
                random = nextRandom
                nextRandom = Math.floor(Math.random()*theTetrominoes.length);
                //slightly reduces the chance of some shape again
                if (nextRandom === random) {
                    nextRandom = Math.floor(Math.random()*theTetrominoes.length);
                }
                current = theTetrominoes[random][currentRotation];
                currentPosition = 4;
                draw();
                displayShape();
                displayHoldShape();
            } else {
                //swap current tetromino with queued tetromino
                undraw();
                tmp = queueIndex;
                queueIndex = random;
                random = tmp;
                current = theTetrominoes[random][currentRotation];
                currentPosition = 4;
                draw();
                displayHoldShape();
            }
        }
    }
  
    //add functionality to the start/pause button
    startBtn.addEventListener('click', () => {
        if (gameEnded) {
            //reset the grid
            squares.forEach(square => {
                if (!square.classList.contains('hidden')) {
                    square.classList.remove('tetromino');
                    square.classList.remove('taken');
                    square.style.backgroundColor = '';
                };
            });
            //reset the score, level, speed, and hold queue
            score = 0;
            scoreDisplay.innerHTML = score;
            level = 1;
            levelDisplay.innerHTML = level;
            speed = 1;
            queueIndex = null;
            displayHoldShape();
            gameEnded = false;
        }
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 500/speed);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });
    
    //add score and remove complete rows
    function addScore() {
        let rowCount = 0;
        for (let i= 0; i < 199; i+=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                rowCount += 1;
                // increase speed and level for every 10 rows cleared
                totalRowCount += 1;
                if (totalRowCount % 10 == 0){
                    level += 1;
                    levelDisplay.innerHTML = level;
                    speed += 0.1;
                    clearInterval(timerId);
                    timerId = setInterval(moveDown, 500/speed);
                };
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            };
        };
        //calculate score based on number of rows cleared at once
        switch(rowCount) {
        case 1:
            score += 100 * level;
            break;
        case 2:
            score += 300 * level;
            break;
        case 3:
            score += 500 * level;
            break;
        case 4:
            score += 800 * level;
        }
        scoreDisplay.innerHTML = score;
        undraw();
    }
  
    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = score + '  ---  Game Over';
            clearInterval(timerId);
            timerId = null; 
            gameEnded = true;
        };
    }
  
})
