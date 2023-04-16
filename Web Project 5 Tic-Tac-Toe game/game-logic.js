// Game logic

// Variable and const declaration
const cellElements = document.querySelectorAll('.cell')
const startGameButton = document.getElementById('start-game-button');
let activePlayerName = document.getElementById('active-player-name');
let playerTurnMessage = document.getElementById('player-turn-message');
let endMessageBlock = document.getElementById('end-message-block');
let winnerMessage = document.getElementById('winner-message');
let winnerName = document.getElementById('winner-name');
let winnerMessageTwo = document.getElementById('winner-message-2');
let drawMessage = document.getElementById('draw-message');

// Global variable that stores end result of game
// 0 if player 1 wins, 1 if player 2 wins and 2 if game is a draw
var endInput = 0;

// Variable that tracks turns
let isPlayer_1_Turn = false;

// Array that stores cells that player selects according to the data-cell
let dataCellNumbersForPlayerOne = [];
let dataCellNumbersForPlayerTwo = [];

// Array that stores winning combinations
const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Function should reset the board back to original stage
function startGame() {
    isPlayer_1_Turn = true;
    dataCellNumbersForPlayerOne = [];
    dataCellNumbersForPlayerTwo = [];
    playerTurnMessage.style.display = 'block';
    endMessageBlock.style.display = 'none';
    activePlayerName.textContent = window.players[0].name;
    cellElements.forEach((cell) => {
        cell.classList.remove('player-1-class', 'player-2-class');
        cell.addEventListener('click', handleCellClick, {once: true });
    });
};

startGameButton.addEventListener('click', startGame);

// Once a cell is clicked, must not have any
// player's symbol on it and then check whether
// current player is winner or draw, if there is 
// then end game, if not then swap turns
function handleCellClick(event) {
    const cell = event.target;
    if (emptyCell(cell)) {
        placeMarker(cell);
        if (checkWinner(dataCellNumbersForPlayerOne, dataCellNumbersForPlayerTwo)) {
            endGame(endInput, players);
        } else if (checkDraw()) {
             endGame(endInput);
        } else {
            swapTurns(players);
        };
    };
};

// Check whether cell is empty
function emptyCell(cell) {
    if(cell.classList.contains('player-1-class', 'player-2-class')) {
        return false;
    };
    return true;
};

// Place player symbol onto cell
function placeMarker(cell) {
    if(isPlayer_1_Turn) {
        cell.classList.add('player-1-class');
        let cellNumber = cell.getAttribute('data-cell');
        dataCellNumbersForPlayerOne.push(cellNumber);
        return;
    } else {
        cell.classList.add('player-2-class');
        let cellNumber = cell.getAttribute('data-cell');
        dataCellNumbersForPlayerTwo.push(cellNumber);
        return;
    };
};

// Check whether player won 
function checkWinner(dataCellNumbersForPlayerOne, dataCellNumbersForPlayerTwo, endInput) {
    if(isPlayer_1_Turn) {
        dataCellNumbersForPlayerOne.sort((a,b) =>a-b);
        if(checkNumbers(dataCellNumbersForPlayerOne) == true) {
            window.endInput = 0;
            return true;
        };
    } else {
        dataCellNumbersForPlayerTwo.sort((a,b) =>a-b);
        if(checkNumbers(dataCellNumbersForPlayerTwo) == true) {
            window.endInput = 1;
            return true;
        };
    };
};

// Iterate through array of winning combi with 
// array of cells player selected to see if they
// match
function checkNumbers(dataCellNumbers) {
    let numberOfMatches;
    for (let i = 0; i < winningCombinations.length; i++) {
        numberOfMatches = 0;
        for(let j = 0; j < dataCellNumbers.length; j++) {
            for(let k = 0; k < 3; k++){
                if(winningCombinations[i][k] == dataCellNumbers[j]) {
                    numberOfMatches++;
                    break;
                };
            };
        };
        if(numberOfMatches == 3) {
            return true;
        }
    };
};

// Check whether game is a draw or not
function checkDraw() {
    if(dataCellNumbersForPlayerOne.length == 5 || dataCellNumbersForPlayerTwo == 5) {
        window.endInput = 2;
        return true;
    };
    return false;
};

// Swap player turns
function swapTurns(players) {
    if(isPlayer_1_Turn) {
        isPlayer_1_Turn = false;
        activePlayerName.textContent = players[1].name;
    } else {
        isPlayer_1_Turn = true;
        activePlayerName.textContent = players[0].name;
    };
};

// End the game and display end message
function endGame(endInput, players) {
    playerTurnMessage.style.display = 'none';
    cellElements.forEach((cell) => {
        cell.removeEventListener('click', handleCellClick);
    });
    if(endInput == 0 || endInput == 1) {
        winnerName.textContent = players[endInput].name;
        endMessageBlock.style.display = 'block';
        winnerMessage.style.display = 'block';
        drawMessage.style.display = 'none';
    } else {
        endMessageBlock.style.display = 'block';
        winnerMessage.style.display ='none'
        drawMessage.style.display = 'block';  
    };
    winnerMessageTwo.style.display = 'block';
};