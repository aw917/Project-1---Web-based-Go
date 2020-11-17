// Pseudo-code

// DOM nodes for:
// - modal
// - board
// - resign btn
// - pass btn


// Game state class
// Turn tracker
// Last move tracker
// Time tracker
// Resign fxn
// Pass fxn + logic
// Captured white stones
// Captured black stones
// White points (end of game)
// Black points (end of game)
// Komi (3.5 points) for white

// Move locations
// Div's for all intersections
// x, y, played (null, white, or black)
// Banning existing stones and only letting you 

// Winning points algorithm
// Counts # of points for win state


// Capturing stones algorithm

// Event listeners
// - modal
// - all board intersection nodes



// ========================================
// Go Game Code
//   - DOM Nodes
//   - Game Classes
//   - Move Locations
//   - Stone Capture
//   - Winning Points
//   - Event Listeners
// ========================================

// ====================
// DOM Nodes
// ====================
// Modal pop-up
const playButton = document.querySelector('#play-button');
const modalDisplay = document.querySelector('.modal');

// Functional buttons
const passButton = document.querySelector('#pass-button');
const resignButton = document.querySelector('#resign-button');

// Board nodes (moved below due to scoping with classes)
const boardDomNode = document.querySelector('.board-div');

// White and black stones
const whiteStone = document.querySelector('.white-stone');
const blackStone = document.querySelector('.black-stone');

// sound effect
const stoneSoundEffect = document.querySelector('#board-sound-effect');


// ====================
// Game Classes
// ====================
let turnTracker = 1;

const getCurrentTurn = () => {
    if (turnTracker % 2 === 0) {
        return "White";
    } else {
        return "Black";
    }
}

class GameState {
    constructor() {
        this.lastMove;
        this.capturedWhiteStones;
        this.capturedBlackStones;
        this.whitePoints;
        this.blackPoints;

        // Pre-set values
        this.komi = 3.5;
        this.boardSize = 9;
    }
    resign() {
        if (getCurrentTurn() === "White") {
            alert(`White resigned!  Black won the game!`)
        } else {
            alert(`Black resigned!  White won the game!`)
        };
    }
    pass () {
        turnTracker += 1;
        if (this.lastMove === "Pass") {
            alert('Both players plassed!  The game is over!')
            // function for counting stones
        } else {
            this.lastMove = "Pass";
        }
    }
    playedStone () {
        turnTracker = turnTracker + 1;
        // to create the below logic
    }
}

const game = new GameState();



// ====================
// Move Locations
// ====================

// Board DOM nodes
let boardSquareHolder = [];

// Create DIV's for board squares
for (let i = 0; i < (game.boardSize * game.boardSize); i++) {
    let boardSquares = document.createElement('div');
    // make board pieces
    boardSquares.setAttribute('class', 'board-squares'); // formatting for dom events
    boardSquares.setAttribute('id', `${i}`); // used to track board location
    boardSquareHolder.push(boardSquares); // array for event listeners
    boardDomNode.appendChild(boardSquares); // put divs onto the board itself
}

//Empty array to hold all the moves
let moveHolder = [];

// Move object template
let moveTemplateObject = {
    x: 1, // x axis of the grid, running form 1 to board.length
    y: 1, // y axis of the grid, running form 1 to board.length
    played: true || false
}

// Generate move object
const generateMove = (evt) => {
    let thisMove = {
        x: 1,
        y: 1,
        played: true
    }
    thisMove.x = Math.floor((Number(evt.target.id) / game.boardSize)) + 1;  // (x, y) = ( rounded down # of times divisible by 9 + 1, remainder + 1)
    thisMove.y = Math.floor((Number(evt.target.id) % game.boardSize)) + 1;
    moveHolder.push(thisMove);
    console.log(moveHolder);
    console.log(thisMove);
}

// Loop over boardSquareHolder div's for div's where id is divisible by 9, set those equal to x = n and y = 1

// ====================
// Stone Capture
// ====================

// ====================
// Counting Points
// ====================

// ====================
// Event Listeners
// ====================
// Modal play button
playButton.addEventListener('click', () => {
    modalDisplay.style.display = "none";
    enableOtherListeners(); // event listeners only accessible once modal is closed
})

/*
Enable other listeners prevents eventlisteners from being triggered
until the modal has been removed (did not indent)
**/
const enableOtherListeners = () => {

// Functional buttons
resignButton.addEventListener('click', game.resign);
passButton.addEventListener('click', game.pass);

// Square titles
for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('click', (evt) => {
    // Control for spots already played in
    if (evt.target.className.includes('played')) {
        // console.log('already played');
    // Logic for white or black
    } else {
        if (getCurrentTurn() === "White") {
            evt.target.setAttribute('class', 'played-white');
            boardSquareHolder[i].style.opacity = 1;
        } else {
            evt.target.setAttribute('class', 'played-black');
            boardSquareHolder[i].style.opacity = 1;
        }
        // Increment and then play sound effect is move is available
        turnTracker ++;
        stoneSoundEffect.play();
        generateMove(evt);
        game.lastMove = moveHolder[turnTracker - 2]; // Turn tracker is incrmented prior to updating this record
    }
    })
}

// Puts hover-over feature
for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('pointerenter', (evt) => {
        // Show hover if the area has not been played
        if (evt.target.className.includes("played")) {
            // Control for whose turn it is
            // console.log('already played');
        } else {
            if (getCurrentTurn() === "White") {
                evt.target.className = "white-stone";
                evt.target.style.opacity = 0.7;
            } else {
                evt.target.className = "black-stone";
                evt.target.style.opacity = 0.7;
            }
        }
    })

}

// Removes hover formatting on exit
for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('pointerout', (evt) => {
    if (evt.target.className.includes("played")) {
        // console.log('already played') 
    } else {
        evt.target.style.opacity = 0;
    }
    })
}

} // end to all post-modal event listeners