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
        if (getCurrentTurn() === "white") {
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
            // to be created
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

//Empty array to hold all the moves
let moveHolder = [];

// Board DOM nodes
let boardSquareHolder = [];
// Create DIV's for board squares
for (let i = 0; i < (game.boardSize * game.boardSize); i++) {
    let boardSquares = document.createElement('div');
    boardSquares.setAttribute('class', 'board-squares');
    boardSquares.setAttribute('id', `${i + 1}-${i + 1}`); // used to track board location
    boardSquareHolder.push(boardSquares);
    boardDomNode.appendChild(boardSquares);
}

// ====================
// Stone Capture
// ====================

// ====================
// Winning Points
// ====================

// ====================
// Event Listeners
// ====================
// Modal play button
playButton.addEventListener('click', () => {
    modalDisplay.style.display = "none";
})

// Functional buttons
resignButton.addEventListener('click', game.resign);
passButton.addEventListener('click', game.pass);

// Functions for squares
const stoneHighlight = (evt) => {
    console.log(evt.target);
}

// Square titles
for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('pointerenter', (evt) => {
        evt.target.appendChild(whiteStone);
        console.log(evt.target);
    })
}