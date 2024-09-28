const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
let code = [];
let rows = [];
const maxAttempts = 10;
let currentAttempt = 0;
let previousGuesses = [];

function generateCode() {
    code = [];
    for (let i = 0; i < 4; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        code.push(randomColor);
    }
}

function createRow() {
    const row = document.createElement('div');
    row.className = 'row';
    for (let i = 0; i < 4; i++) {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color';
        colorDiv.onclick = () => changeColor(colorDiv);
        row.appendChild(colorDiv);
    }
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback';
    row.appendChild(feedbackDiv);
    rows.push(row);
    document.getElementById('board').appendChild(row);
}

function changeColor(element) {
    let currentColor = element.style.backgroundColor;
    let index = colors.indexOf(currentColor);
    index = (index + 1) % colors.length;
    element.style.backgroundColor = colors[index];
}

function isValidMove(guess) {
    if (guess.includes('')) {
        shakeButton();
        return false;
    }
    if (previousGuesses.some(g => g.join('') === guess.join(''))) {
        shakeButton();
        return false;
    }
    return true;
}

function shakeButton() {
    const button = document.getElementById('checkButton');
    button.classList.add('shake');
    setTimeout(() => button.classList.remove('shake'), 500);
}

function displayCode(screenId) {
    const screen = document.getElementById(screenId);
    const codeDisplay = screen.querySelector('.code-display');
    codeDisplay.innerHTML = '';
    code.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'code-color';
        colorDiv.style.backgroundColor = color;
        codeDisplay.appendChild(colorDiv);
    });
}

function checkGuess() {
    const guess = Array.from(rows[currentAttempt].children)
        .slice(0, 4)
        .map(div => div.style.backgroundColor);

    if (!isValidMove(guess)) return;

    previousGuesses.push(guess);

    let correctColorAndPosition = 0;
    let correctColorWrongPosition = 0;
    const codeCopy = [...code];
    const guessCopy = [...guess];

    for (let i = 0; i < 4; i++) {
        if (guess[i] === code[i]) {
            correctColorAndPosition++;
            codeCopy[i] = guessCopy[i] = null;
        }
    }
    
    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
            correctColorWrongPosition++;
            codeCopy[codeCopy.indexOf(guessCopy[i])] = null;
        }
    }

    const feedbackDiv = rows[currentAttempt].querySelector('.feedback');
    feedbackDiv.innerHTML = '';
    
    for (let i = 0; i < correctColorAndPosition; i++) {
        const blackDot = document.createElement('div');
        blackDot.className = 'dot black-dot';
        feedbackDiv.appendChild(blackDot);
    }
    for (let i = 0; i < correctColorWrongPosition; i++) {
        const greyDot = document.createElement('div');
        greyDot.className = 'dot grey-dot';
        feedbackDiv.appendChild(greyDot);
    }

    if (correctColorAndPosition === 4) {
        displayCode('winScreen');
        document.getElementById('winScreen').style.display = 'flex';
    } else {
        currentAttempt++;
        if (currentAttempt < maxAttempts) createRow();
        else {
            displayCode('gameOverScreen');
            document.getElementById('gameOverScreen').style.display = 'flex';
        }
    }
}

function newGame() {
    document.getElementById('board').innerHTML = '';
    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    rows = [];
    previousGuesses = [];
    currentAttempt = 0;
    generateCode();
    createRow();
}

function quitGame() {
    displayCode('gameOverScreen');
    document.getElementById('gameOverScreen').style.display = 'flex';
}

function displayColorOptions() {
    const colorOptionsDiv = document.getElementById('colorOptions');
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'code-color';
        colorDiv.style.backgroundColor = color;
        colorOptionsDiv.appendChild(colorDiv);
    });
}

// Initialize the game
generateCode();
createRow();
displayColorOptions();
