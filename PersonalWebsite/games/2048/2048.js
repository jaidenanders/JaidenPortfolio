document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 4;
    let squares = [];
    let score = 0;

    // Create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.innerHTML = 0;
            square.classList.add("tile-0"); // Initial color for 0 value
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generateNewTile();
        generateNewTile();
    }

    // Generate a new number tile in a random empty square with animation
    function generateNewTile() {
        let randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            updateTileClass(squares[randomNumber]);
            squares[randomNumber].classList.add("tile-appear"); // Add appear animation
            setTimeout(() => squares[randomNumber].classList.remove("tile-appear"), 200);
            checkGameOver();
        } else generateNewTile();
    }

    // Update tile classes based on value
    function updateTileClass(square) {
        let value = parseInt(square.innerHTML);
        square.className = ""; // Reset class list
        if (value > 2048) {
            square.classList.add("tile-beyond"); // Apply "beyond" class for values > 2048
        } else {
            square.classList.add("tile-" + value);
        }
    }

    // Swipe and Combine Functions
    function moveRight() {
        for (let i = 0; i < width * width; i++) {
            if (i % width === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML),
                ];

                let filteredRow = row.filter((num) => num);
                let missing = width - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = zeros.concat(filteredRow);

                for (let j = 0; j < width; j++) {
                    squares[i + j].innerHTML = newRow[j];
                    updateTileClass(squares[i + j]);
                }
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < width * width; i++) {
            if (i % width === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML),
                ];

                let filteredRow = row.filter((num) => num);
                let missing = width - filteredRow.length;
                let zeros = Array(missing).fill(0);
                let newRow = filteredRow.concat(zeros);

                for (let j = 0; j < width; j++) {
                    squares[i + j].innerHTML = newRow[j];
                    updateTileClass(squares[i + j]);
                }
            }
        }
    }

    function moveDown() {
        for (let i = 0; i < width; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + width * 2].innerHTML),
                parseInt(squares[i + width * 3].innerHTML),
            ];

            let filteredColumn = column.filter((num) => num);
            let missing = width - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn);

            for (let j = 0; j < width; j++) {
                squares[i + j * width].innerHTML = newColumn[j];
                updateTileClass(squares[i + j * width]);
            }
        }
    }

    function moveUp() {
        for (let i = 0; i < width; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + width * 2].innerHTML),
                parseInt(squares[i + width * 3].innerHTML),
            ];

            let filteredColumn = column.filter((num) => num);
            let missing = width - filteredColumn.length;
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros);

            for (let j = 0; j < width; j++) {
                squares[i + j * width].innerHTML = newColumn[j];
                updateTileClass(squares[i + j * width]);
            }
        }
    }

    function combineRow() {
        for (let i = 0; i < width * width - 1; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = 0;
                updateTileClass(squares[i]);
                squares[i].classList.add("tile-merge"); // Add merge animation
                setTimeout(() => squares[i].classList.remove("tile-merge"), 300);
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkWin();
    }

    function combineColumn() {
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i + width].innerHTML = 0;
                updateTileClass(squares[i]);
                squares[i].classList.add("tile-merge"); // Add merge animation
                setTimeout(() => squares[i].classList.remove("tile-merge"), 300);
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        checkWin();
    }

    // Key Controls
    function control(e) {
        if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 38) {
            keyUp();
        } else if (e.keyCode === 40) {
            keyDown();
        }
    }
    document.addEventListener("keyup", control);

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generateNewTile();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generateNewTile();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generateNewTile();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generateNewTile();
    }

    // Check for win or game over
    function checkWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                alert("You WIN!");
                document.removeEventListener("keyup", control);
            }
        }
    }

    function checkGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }
        if (zeros === 0) {
            alert("Game Over!");
            document.removeEventListener("keyup", control);
        }
    }

    createBoard();
});
