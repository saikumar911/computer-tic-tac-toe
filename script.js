const board = document.querySelector('#board');
const cells = document.querySelectorAll('[data-cell]');
const statusText = document.querySelector('#status');
const restartButton = document.querySelector('#restartButton');
const difficultySelect = document.querySelector('#difficulty');
const player = 'X';
const computer = 'O';
let boardArray;

startGame();

restartButton.addEventListener('click', startGame);
difficultySelect.addEventListener('change', startGame);

function startGame() {
    boardArray = Array.from({ length: 9 }).fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    statusText.textContent = "Your turn";
}

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);
    if (boardArray[index] === '') {
        placeMark(cell, index, player);
        if (checkWin(player)) {
            endGame(false, player);
        } else if (isDraw()) {
            endGame(true);
        } else {
            setTimeout(computerMove, 500);
        }
    }
}

function placeMark(cell, index, mark) {
    boardArray[index] = mark;
    cell.textContent = mark;
}

function computerMove() {
    let move;
    const difficulty = difficultySelect.value;
    if (difficulty === 'hard') {
        move = getBestMove(boardArray);
    } else if (difficulty === 'medium') {
        move = getMediumMove(boardArray);
    } else {
        move = getEasyMove(boardArray);
    }
    const cell = cells[move];
    placeMark(cell, move, computer);
    if (checkWin(computer)) {
        endGame(false, computer);
    } else if (isDraw()) {
        endGame(true);
    }
}

function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function getMediumMove(board) {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    if (Math.random() > 0.5) {
        return getBestMove(board);
    } else {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
}

function getEasyMove(board) {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(computer)) {
        return 10 - depth;
    } else if (checkWin(player)) {
        return depth - 10;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computer;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(mark) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => boardArray[index] === mark));
}

function isDraw() {
    return boardArray.every(cell => cell !== '');
}

function endGame(draw, winner = null) {
    if (draw) {
        statusText.textContent = "It's a draw!";
    } else {
        statusText.textContent = `Player ${winner} wins!`;
    }
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}