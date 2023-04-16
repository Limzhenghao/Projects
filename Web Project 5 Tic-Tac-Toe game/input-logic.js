// Consts for edit buttons to show overlay
const editButton1 = document.getElementById('edit-button1');
const editButton2 = document.getElementById('edit-button2');

// Array for player data
window.players = [
    {
        name: 'Player 1 name',
        symbol: 'X'
    },
    {
        name: 'Player 2 name',
        symbol: 'O'
    },
];


// Consts for overlay and backdrop
const inputOverlay = document.querySelector('.input-player');
const inputBackdrop = document.getElementById('backdrop');

// Const for cancel form submission button on overlay
const cancelOverlayButton = document.getElementById('cancel-button');

// Const for form
const userInputForm = document.querySelector('form');

// Variable for number of player that clicked on edit button
let playerNumber = 0;

const inputField = document.getElementById('playername');

// Function to show overlay to change player name
function showInputOverlay(event) {

    // Store number associated with edit button of player
    playerNumber = +event.target.dataset.playernumber; // +'1' => 1

    // Show overlay and background
    inputOverlay.style.display = 'block';
    inputBackdrop.style.display = 'block';
};
editButton1.addEventListener('click', showInputOverlay);
editButton2.addEventListener('click', showInputOverlay);


// Function to cancel overlay
function cancelInputOverlay() {
    inputOverlay.style.display = 'none';
    inputBackdrop.style.display = 'none';
    document.querySelector('.valid-name').classList.remove('invalid-name');
    document.querySelector('input').classList.remove('invalid-name2');
};
cancelOverlayButton.addEventListener('click', cancelInputOverlay);


// Function to save and validate player name changes
function savePlayerInfo(event) {

    // Prevent page refresh and process data first before sending
    event.preventDefault();

    // Extract values entered into inputs automatically
    const formData = new FormData(event.target);

    // Access form data by its 'name' attribute and get rid of all spaces inside
    const enteredPlayerName = formData.get('playername').trim();

    // If input is all spaces, reject
    if(!enteredPlayerName) {
        document.querySelector('.valid-name').classList.add('invalid-name');
        inputField.classList.add('invalid-name2');
        return
    }

    // If valid, change player's name on main screen
    const clickedButtonPlayerData = document.getElementById('player-' + playerNumber + '-data');
    clickedButtonPlayerData.children[1].textContent = enteredPlayerName;

    // Store new name in global const
    players[playerNumber - 1].name = enteredPlayerName;
    document.querySelector('.valid-name').classList.remove('invalid-name');
    inputField.classList.remove('invalid-name2');
    userInputForm.reset();
    cancelInputOverlay();

};
userInputForm.addEventListener('submit', savePlayerInfo)
