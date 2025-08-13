/*// Select DOM elements
const cells = document.querySelectorAll('[data-cell]');
const winnerMessage = document.getElementById('winner-message');
const restartButton = document.getElementById('restart-button');

let board = ['', '', '', '', '', '', '', '', ''];  // Game board state
let currentPlayer = 'X';  // Player 'X' starts the game

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle a cell click
const handleCellClick = (index) => {
    // If the cell is already filled, do nothing
    if (board[index] !== '') return;

    // Update board with the current player's move
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    // Check if there is a winner
    if (checkWinner()) {
        winnerMessage.textContent = `${currentPlayer} wins!`;
        winnerMessage.classList.remove('hidden');
        restartButton.classList.remove('hidden');
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));  // Disable further moves
    } else if (board.every(cell => cell !== '')) {
        // Check for draw (no empty cells left)
        winnerMessage.textContent = "It's a draw!";
        winnerMessage.classList.remove('hidden');
        restartButton.classList.remove('hidden');
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// Function to check if there is a winner
const checkWinner = () => {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
};

// Function to reset the game
const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];  // Reset board state
    currentPlayer = 'X';  // Reset to player 'X'
    winnerMessage.classList.add('hidden');
    restartButton.classList.add('hidden');
    cells.forEach((cell, index) => {
        cell.textContent = '';  // Clear text in each cell
        cell.addEventListener('click', () => handleCellClick(index));  // Re-enable click events
    });
};

// Attach event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

// Attach event listener to the restart button
restartButton.addEventListener('click', resetGame);

// Initialize the game (no winner message or button initially)
winnerMessage.classList.add('hidden');
restartButton.classList.add('hidden');*/

// Select DOM elements
const cells = document.querySelectorAll('[data-cell]');
const winnerMessage = document.getElementById('winner-message');
const restartButton = document.getElementById('restart-button');

let board = ['', '', '', '', '', '', '', '', ''];  // Game board state
let currentPlayer = 'X';  // Player 'X' starts the game

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle a cell click
const handleCellClick = (index) => {
    if (board[index] !== '' || checkWinner()) return;

    board[index] = 'X';
    cells[index].textContent = 'X';
    
    if (checkWinner()) {
        showWinner('X');
        return;
    }

    if (!board.includes('')) {
        showWinner(null);  // Draw
        return;
    }

    setTimeout(aiMove, 300);  // AI move after short delay
};

// Function for AI move (Minimax Algorithm)
const aiMove = () => {
    let bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    
    if (checkWinner()) {
        showWinner('O');
    }
};

// Minimax algorithm to find the best move for AI
const minimax = (newBoard, player) => {
    let emptySpots = newBoard.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);

    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (emptySpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptySpots) {
        let move = { index: i };
        newBoard[i] = player;

        if (player === 'O') {
            move.score = minimax(newBoard, 'X').score;
        } else {
            move.score = minimax(newBoard, 'O').score;
        }

        newBoard[i] = '';
        moves.push(move);
    }

    return moves.reduce((bestMove, move) => {
        if ((player === 'O' && move.score > bestMove.score) || (player === 'X' && move.score < bestMove.score)) {
            return move;
        }
        return bestMove;
    }, { score: player === 'O' ? -Infinity : Infinity });
};

// Function to check if a player has won
const checkWin = (boardState, player) => {
    return winningCombinations.some(combination => 
        combination.every(index => boardState[index] === player)
    );
};

const checkWinner = () => {
    if (checkWin(board, 'X')) return 'X';
    if (checkWin(board, 'O')) return 'O';
    return null;
};

const showWinner = (winner) => {
    if (winner) {
        winnerMessage.textContent = `${winner} wins!`;
    } else {
        winnerMessage.textContent = "It's a draw!";
    }
    winnerMessage.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
};

const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    winnerMessage.classList.add('hidden');
    restartButton.classList.add('hidden');
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.addEventListener('click', () => handleCellClick(index));
    });
};

// Attach event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

restartButton.addEventListener('click', resetGame);



