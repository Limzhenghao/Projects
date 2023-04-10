const editButton = document.getElementById('edit-button1');
const inputOverlay1 = document.querySelector('.input-player1');
const inputBackdrop = document.getElementById('backdrop');
function showInputOverlay1() {
    inputOverlay1.style.display = 'block';
    inputBackdrop.style.display = 'block';
}

editButton.addEventListener('click', showInputOverlay1);