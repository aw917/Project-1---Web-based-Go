//
// ======================================
// Note to Potential Reviewers
// ======================================
//
//   This code was compiled as of November 23, 2020 over the course of 5 business days for Project 1 of GA's Software Engineering Immersive bootcamp. 
//   Prior to GA, I had no coding experience, so this demonstrates progress made after learning to code for net ~5 weeks (3 weeks of class, 2 weeks self-taught).
//   Conventions that are not followed, such as spacing or otherwise, and inefficencies in how the code is written are largely due to my inexperience and
//   I welcome any and all feedback on how to improve them.
//
//   Of note, I want to highlight a couple points of pride for this program:
//      - A successful, recursive algorithm for stone capture
//      - Enjoyable user experience and a very approachable UI / UX
//      - The robust nature of the code (written with board size as an input, class for games, and generating board elements)
//
//  Additionally, these are known areas of improvement:
//      - The recursive algorithm for stone capture is written inefficienctly (surroundFunction1 and surroundFunction2 are nearly identical)
//      - There are bugs around playing stones in areas that have already been captured (persists due to a time and knowledge limitaiton)
//      - Variable declaration is inconsistently global / local, and is a source of some errors (persists due to my inexperience limitaiton)
//      - Point counting has been done manually due to time limitations
//
//  Finally, time permitting, these are the features that I would add:
//      - Prevent illegal moves (you can currently play in a space that would capture a stone)
//      - Ko / superko logic (how many times positions can be repeated in go, due to capturing one stone after another)
//      - Automatic point counting (incl. smart deadstone detection)
//
//  Thank you for your consideration and please let me know how this code can be improved!
//
// ========================================
// Go Game Code
//   - DOM Nodes
//   - Game Classes
//   - Move Locations
//   - Stone Capture
//   - Counting Points
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

// Container
const actionButton = document.querySelector('.action-buttons');

// Board nodes (moved below due to scoping with classes)
const boardDomNode = document.querySelector('.board-div');

// White and black stones
const whiteStone = document.querySelector('.white-stone');
const blackStone = document.querySelector('.black-stone');

// captured counts
const whiteCapturedCount = document.querySelector('#black-captured-count');
const blackCapturedCount = document.querySelector('#white-captured-count');

// dead stones
// const whiteDeadStones = document.querySelector('.white-stone');
// const blackDeadStones = document.querySelector('.black-stone');

// sound effect
const stoneSoundEffect = document.querySelector('#board-sound-effect');


// ====================
// Game Classes
// ====================
// Used to track whether it's white or black's turn
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
        this.capturedWhiteStones = 0;
        this.capturedBlackStones = 0;
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
            // function counting points
            countPoints();
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

// Generate move object on 9 x 9 grid (x, y) => from (1, 1) to (9, 9)
const generateMove = (evt) => {
    let thisMove = {
        x: 0,
        y: 0,
        played: true,
        color: getCurrentTurn()
    }
    // Convert div id's to x, y locations
    thisMove.x = Math.floor((Number(evt.target.id) / game.boardSize)) + 1;  // (x, y) = ( rounded down # of times divisible by 9 + 1, remainder + 1)
    thisMove.y = Math.floor((Number(evt.target.id) % game.boardSize)) + 1;
    // Track moves by pushing them into an array 
    moveHolder.push(thisMove);
    console.log(moveHolder);
    checkForBlanks(thisMove, thisMove, thisMove);
}

// ====================
// Stone Capture
// ====================

// Used for checking logic
let capturedFinalTestArray = [];

// Check blanks
const checkForBlanks = (moveX, moveY, moveColor) => {
    
    // Collect temporary results for testing for blanks
    let testBlankArrayTemporary = [];
    testBlankArrayTemporary = [];

    // Check if move touchs one above, below, left, or right
    let aboveTest = moveHolder.find(moveHolder => moveHolder.x === (moveX.x - 1) && moveHolder.y === moveY.y);
    let belowTest = moveHolder.find(moveHolder => moveHolder.x === (moveX.x + 1) && moveHolder.y === moveY.y);
    let leftTest = moveHolder.find(moveHolder => moveHolder.y === (moveY.y - 1) && moveHolder.x === moveX.x);
    let rightTest = moveHolder.find(moveHolder => moveHolder.y === (moveY.y + 1) && moveHolder.x === moveX.x);

    let capturedTestArray = [];
    capturedTestArray = [];
    // Check for boundaries of the board
    if ((moveX.x - 1) >= 1 && (moveX.x + 1) <= game.boardSize && (moveY.y - 1) >= 1 && (moveY.y + 1) <= game.boardSize) {
        // Check if any stone left or right exists, if it does, put it into the array to be tested for later
        if (aboveTest) {
            testBlankArrayTemporary.push(aboveTest);
            capturedTestArray.push('captured');
        } else {
            capturedTestArray.push('blank');
        }
        if (belowTest) {
            testBlankArrayTemporary.push(belowTest);
            capturedTestArray.push('captured');
        } else {
            capturedTestArray.push('blank');
        }
        if (leftTest) {
            testBlankArrayTemporary.push(leftTest);
            capturedTestArray.push('captured');
        } else {
            capturedTestArray.push('blank');
        }
        if (rightTest) {
            testBlankArrayTemporary.push(rightTest);
            capturedTestArray.push('captured');
        } else {
            capturedTestArray.push('blank');
        }
    } else {
// This section runs through every corner and edge scenario and then runs the stone touching checking algorithm only for that
// relevant edge or corner - i.e., if x = 1 and y = 4, you wouldn't check above.  If x = 9 and y = 9, the program
// will only check left and above.
        // check if it's a corner or an edge
        // check all of the 4 corners
        // 1, 1
        if (moveX.x === 1 && moveY.y === 1) {
            if (belowTest) {
                testBlankArrayTemporary.push(belowTest);
            }
            if (rightTest) {
                testBlankArrayTemporary.push(rightTest);
            } 
        }
        // 1, 9
        if (moveX.x === 1 && moveY.y === game.boardSize) {
            if (belowTest) {
                testBlankArrayTemporary.push(belowTest);
            }
            if (leftTest) {
                testBlankArrayTemporary.push(leftTest);
            } 
        }
        // 9, 1
        if (moveX.x === game.boardSize && moveY.y === 1) {
            if (aboveTest) {
                testBlankArrayTemporary.push(aboveTest);
            }
            if (rightTest) {
                testBlankArrayTemporary.push(rightTest);
            }
        }
        // 9, 9
        if (moveX.x === game.boardSize && moveY.y === game.boardSize) {
            if (aboveTest) {
                testBlankArrayTemporary.push(aboveTest);
            }
            if (leftTest) {
                testBlankArrayTemporary.push(leftTest);
            }
        }
    // check 4 edges
    // // x = 1
        if (moveX.x === 1) {
            if (belowTest) {
                testBlankArrayTemporary.push(belowTest);
            }
            if (leftTest) {
                testBlankArrayTemporary.push(leftTest);
            }
            if (rightTest) {
                testBlankArrayTemporary.push(rightTest);
            }
        }
            // x = 9
        if (moveX.x === game.boardSize) {
            if (aboveTest) {
                testBlankArrayTemporary.push(aboveTest);
            }
            if (leftTest) {
                testBlankArrayTemporary.push(leftTest);
            }
            if (rightTest) {
                testBlankArrayTemporary.push(rightTest);
            }
        }
        // y = 1
        if (moveY.y === 1) {
            if (aboveTest) {
                testBlankArrayTemporary.push(aboveTest);
            }
            if (belowTest) {
                testBlankArrayTemporary.push(belowTest);
            }
            if (rightTest) {
                testBlankArrayTemporary.push(rightTest);
            }
        }
        // y = 9
        if (moveY.y === game.boardSize) {
            if (aboveTest) {
                testBlankArrayTemporary.push(aboveTest);
            }
            if (belowTest) {
                testBlankArrayTemporary.push(belowTest);
            }
            if (leftTest) {
                testBlankArrayTemporary.push(leftTest);
            }
        }
    }

    // if there are any intersections, check for colors
    if (testBlankArrayTemporary.length > 0) {

        // Get stones that are touching, and are the opposite color
        let oppositeColorStones = [];

        // Put all opposite colored stones into an array
        for (let i = 0; i < testBlankArrayTemporary.length; i++) {

            // if this move is a neighbor of the other, check the color
            if ((testBlankArrayTemporary[i].x - moveX.x <= 1) && (testBlankArrayTemporary[i].y - moveY.y <= 1)) {
                if (testBlankArrayTemporary[i].color !== moveColor.color) {
                    oppositeColorStones.push(testBlankArrayTemporary[i]);
                }
            }
        }
        
        // Take every opposite color stone and generates an array with their clusters
        for (let i = 0; i < oppositeColorStones.length; i++) {
            // Run recursive clumping function
            surroundFunction1(oppositeColorStones[i]);

            // Prevent creating double arrays if a stone touches two of opposite colors
            let checkDuplicateArray = capturedFinalTestArray;
            function existsPrevious(element) {
                return (element.x === checkDuplicateArray.x && element.y === checkDuplicateArray.y);
            }

            // If that array exists already, stop the loop
            if (capturedFinalTestArray.find(existsPrevious)) {
                break;
            }

            // check if cluster captured
            if (checkIfSurroundIsCapture(capturedFinalTestArray) === 'captured') {
                performCapture(capturedFinalTestArray);
            } else {
                // log that it's not captured
                console.log('no action needed as not captured');
            }
            // run true multiple times
            console.log(capturedFinalTestArray);
            // reset as blanks
            capturedTestArray = [];
            testBlankArrayTemporary = [];
            oppositeColorStones = [];
            
            // reset to null array
            capturedFinalTestArray = [];
        }
        
        // After all stones are checked, stop the loop
        
    } else {
        console.log('Not touching any stone');
    }
}


// ==================================================================================================
// surroundFunction(s) 1 and 2 are recursive functions, whereby, they ingest an opposite colored stone touching what was most recently played, and then
// puts all touching, opposite-colored stones into an array (if touching multiple stones that do not touch themselves, then they are seperate arrays).
// They continuously feed off of one another until they complete.
// They are bounded by above/below/left/right test logic.

// Function for checking if captured
const surroundFunction1 = (obj) => {

    let aboveTest = moveHolder.find(moveHolder => moveHolder.x === (obj.x - 1) && moveHolder.y === obj.y);
    let belowTest = moveHolder.find(moveHolder => moveHolder.x === (obj.x + 1) && moveHolder.y === obj.y);
    let leftTest = moveHolder.find(moveHolder => moveHolder.y === (obj.y - 1) && moveHolder.x === obj.x);
    let rightTest = moveHolder.find(moveHolder => moveHolder.y === (obj.y + 1) && moveHolder.x === obj.x);
    
    function existsPrevious(element) {
        return (element.x === obj.x && element.y === obj.y);
    }
    if (capturedFinalTestArray.find(existsPrevious)) {
        stop();
    } else {
        capturedFinalTestArray.push(obj);
        if (aboveTest && belowTest && leftTest && rightTest && aboveTest.color !== obj.color && belowTest.color !== obj.color && leftTest.color !== obj.color && rightTest.color !== obj.color) {
            console.log('captured');
        }
        if (aboveTest) {
            if ((aboveTest.color === obj.color)) {
                surroundFunction2(aboveTest);
            }
        }
        if (belowTest) {
            if ((belowTest.color === obj.color)) {
                surroundFunction2(belowTest);
            }
        }
        if (leftTest) {
            if ((leftTest.color === obj.color)) {
                surroundFunction2(leftTest);
            }
        }
        if (rightTest) {
            if ((rightTest.color === obj.color)) {
                surroundFunction2(rightTest);
            }
        }
    }
}

// Recursive pair to surroundfunction1
const surroundFunction2 = (obj) => {
    let aboveTest = moveHolder.find(moveHolder => moveHolder.x === (obj.x - 1) && moveHolder.y === obj.y);
    let belowTest = moveHolder.find(moveHolder => moveHolder.x === (obj.x + 1) && moveHolder.y === obj.y);
    let leftTest = moveHolder.find(moveHolder => moveHolder.y === (obj.y - 1) && moveHolder.x === obj.x);
    let rightTest = moveHolder.find(moveHolder => moveHolder.y === (obj.y + 1) && moveHolder.x === obj.x);
    function existsPrevious(element) {
        return (element.x === obj.x && element.y === obj.y);
    }
    if (capturedFinalTestArray.find(existsPrevious)) {
        stop();
    } else {
        capturedFinalTestArray.push(obj);
        if (aboveTest) {
            if (aboveTest.color === obj.color) {
                surroundFunction1(aboveTest);
            }
        }
        if (belowTest) {
            if (belowTest.color == obj.color) {
                surroundFunction1(belowTest);
            }
        }
        if (leftTest) {
            if (leftTest.color === obj.color) {
                surroundFunction1(leftTest);
            }
        }
        if (rightTest) {
            if (rightTest.color === obj.color) {
                surroundFunction1(rightTest);
            }
        }
    }
}

// ==================================================================================================
// This function mirrors the above in that it checks all off its surroundings for any stone that exists.  Because
// the color check is performed above, where it flips colors and then clusters all of them, it runs through
// a check where if everything exists, then it is captured
const checkIfSurroundIsCapture = (obj) => {
    let capturedTestArray = [];
    // Check every stone within a group
    for (i = 0; i < obj.length; i++) {
        // rename each array element for sake of ease
        let element = obj[i];
        let aboveTest = moveHolder.find(moveHolder => moveHolder.x === (element.x - 1) && moveHolder.y === element.y);
        let belowTest = moveHolder.find(moveHolder => moveHolder.x === (element.x + 1) && moveHolder.y === element.y);
        let leftTest = moveHolder.find(moveHolder => moveHolder.y === (element.y - 1) && moveHolder.x === element.x);
        let rightTest = moveHolder.find(moveHolder => moveHolder.y === (element.y + 1) && moveHolder.x === element.x);

        if ((element.x - 1) >= 1 && (element.x + 1) <= game.boardSize && (element.y - 1) >= 1 && (element.y + 1) <= game.boardSize) {
            // Check if any stone left or right exists, if it does, put it into the array to be tested for later
            if (aboveTest) {
                capturedTestArray.push('captured');
            } else {
                capturedTestArray.push('blank');
            }
            if (belowTest) {
                capturedTestArray.push('captured');
            } else {
                capturedTestArray.push('blank');
            }
            if (leftTest) {
                capturedTestArray.push('captured');
            } else {
                capturedTestArray.push('blank');
            }
            if (rightTest) {
                capturedTestArray.push('captured');
            } else {
                capturedTestArray.push('blank');
            }
            // check if it's the corner or the edge
        } else if ( (element.x === 1 || element.x === game.boardSize) && (element.y === 1 || element.y === game.boardSize)) {
    // This section runs through every corner and edge scenario
    // relevant edge or corner - i.e., if x = 1 and y = 4, you wouldn't check above.  If x = 9 and y = 9, the program
    // will only check left and above.
            // check if it's a corner or an edge
            // check all of the 4 corners
            // 1, 1
            if (element.x === 1 && element.y === 1) {
                if (belowTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (rightTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
            // 1, 9
            if (element.x === 1 && element.y === game.boardSize) {
                if (belowTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (leftTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
            // 9, 1
            if (element.x === game.boardSize && element.y === 1) {
                if (aboveTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (rightTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
            // 9, 9
            if (element.x === game.boardSize && element.y === game.boardSize) {
                if (aboveTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (leftTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
        } else {
        // check 4 edges
        // // x = 1
            if (element.x === 1) {
                if (belowTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (leftTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (rightTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
                // x = 9
            if (element.x === game.boardSize) {
                if (aboveTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (leftTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (rightTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
            // y = 1
            if (element.y === 1) {
                if (aboveTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (belowTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (rightTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
            // y = 9
            if (element.y === game.boardSize) {
                if (aboveTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (belowTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
                if (leftTest) {
                    capturedTestArray.push('captured');
                } else {
                    capturedTestArray.push('blank');
                }
            }
        }
    }
    if (capturedTestArray.includes('blank')) {
        return 'not captured';
    } else {

        return 'captured';
    }
    // reset testing array to null
    capturedTestArray = [];
}

// This functions both renders the capture and does the back-end needed to clear the board
// Please note, the bug that is causing the issue with stones being captured without need is probably within here.
const performCapture = (obj) => {
    // add captured points to total captured points to the correct color
    if (obj[0].color === 'White') {
        game.capturedWhiteStones = game.capturedWhiteStones + obj.length;
        whiteCapturedCount.innerText = `${game.capturedWhiteStones}`;
    } else {
        game.capturedBlackStones = game.capturedBlackStones + obj.length;
        blackCapturedCount.innerText = `${game.capturedBlackStones}`;
    }

    // put all divs' id's into an array
    let idHolder = [];
    for (let i = 0; i < obj.length; i++) {
        let tempId;
        let element = obj[i];
        // reverse div 0 - 80, to (1, 1) to (9, 9)
        tempId = (element.x - 1) * game.boardSize + element.y - 1;
        idHolder.push(tempId);
    }
    
    // turn transparency to 0 and change class name for each of the divs
    for (i = 0; i < idHolder.length; i++) {
        let stoneCapturedDiv = document.getElementById(`${idHolder[i]}`);
        stoneCapturedDiv.style.opacity = 0;
        stoneCapturedDiv.setAttribute('class', 'board-squares');
    }

    // Remove the captured moves from the moveHolder
    for (let i = 0; i < obj.length; i++) {
        // Thank you to a classmate for this solution
        // Get index for each obj
        let index = moveHolder.findIndex(el => el.x === obj[i].x && el.y === obj[i].y);
        //remove them from the move holder
        moveHolder.splice(index, 1)
    }

    console.log(moveHolder);
    // reset arrays to null
    idHolder = [];
    capturedFinalTestArray = [];
}


// ====================
// Event Listeners
// ====================

// Modal play button
playButton.addEventListener('click', () => {
    modalDisplay.style.display = "none";
    // enableOtherListeners(); // event listeners only accessible once modal is closed
})

// Initial functional buttons
resignButton.addEventListener('click', game.resign);
passButton.addEventListener('click', game.pass);

// Square tiles
for (let i = 0; i < boardSquareHolder.length; i++) {
    const clickBoardSquare = (evt) => {
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
        generateMove(evt);
        turnTracker ++;
        stoneSoundEffect.play();
        game.lastMove = moveHolder[turnTracker - 2]; // Turn tracker is incrmented prior to updating this record
    }
    }
    boardSquareHolder[i].addEventListener('click', clickBoardSquare);
}

// Puts hover-over feature
const hoverInFeature = (evt) => {
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
}

for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('pointerenter', hoverInFeature)
}

const hoverOutFeature = (evt) =>{
    if (evt.target.className.includes("played")) {
        // nothing, already happened
    } else {
        evt.target.className = "board-squares";
        evt.target.style.opacity = 0;
    }
}
// Removes hover formatting on on counting
for (let i = 0; i < boardSquareHolder.length; i++) {
    boardSquareHolder[i].addEventListener('pointerout', hoverOutFeature)
}

// ====================
// Counting Points
// ====================

let totalBlackPoints = 0;
let totalWhitePoints = 0;

// How to handle clicks on empty spaces
const countPointsManual = (evt) => {
    // Clear moveholder every time you count to prevent capture logic
    moveHolder = [];
    // Set target opcaity to 80% to distinguish from played/hovering
    let target = evt.target;
    target.style.opacity = 0.8;
    if (getCurrentTurn() === "White") {
        target.innerText = "W";
        target.className = "counted-white";
    } else {
        target.innerText = "B";
        target.className = "counted-black";
    }
    turnTracker --;
}

const comparePoints = () => {
    // Count all counted white and black
    let countedWhite = document.querySelectorAll('.counted-white');
    let countedBlack = document.querySelectorAll('.counted-black');
    
    // Count all dead white and black
    let deadWhite = document.querySelectorAll('.dead-white');
    let deadBlack = document.querySelectorAll('.dead-black');
    
    // Add up the total points
    totalBlackPoints = countedBlack.length + game.capturedWhiteStones + (deadWhite.length * 2);
    totalWhitePoints = countedWhite.length + game.komi + game.capturedBlackStones + (deadBlack.length * 2);
    // Alert based on the winner
    if (totalBlackPoints > totalWhitePoints) {
        alert(`Black has ${totalBlackPoints} points and white has ${totalWhitePoints}, black won!`);
    } else {
        alert(`Black has ${totalBlackPoints} points and white has ${totalWhitePoints}, white won!`);
    }
}

// Series of actions performed when pass is pressed twice
const countPoints = () => {
    // Add button to count points allow for switching colors on the event listener
    let switchColors = document.createElement('button');
    actionButton.appendChild(switchColors);
    switchColors.innerText = 'switch colors';
    switchColors.addEventListener('click', () => turnTracker++);
    // Add button to compare the points
    let finishCounting = document.createElement('button');
    actionButton.appendChild(finishCounting);
    finishCounting.innerText = 'finish counting';
    finishCounting.addEventListener('click', comparePoints);
    // Update event listeners for empty spaces
    let emptyBoardSquares = document.querySelectorAll('.board-squares');
    for (let i = 0; i < emptyBoardSquares.length; i++) {
        emptyBoardSquares[i].removeEventListener('pointerout', hoverOutFeature);
        emptyBoardSquares[i].removeEventListener('pointerenter', hoverInFeature);
        emptyBoardSquares[i].addEventListener('click', countPointsManual);
    }
    // Update event listeners for dead stones

     // Get all played points
     const playedWhite = document.querySelectorAll('.played-white');
     const playedBlack = document.querySelectorAll('.played-black');

     // Put event listeners on played stones to allow for marking them dead
     // Mark black stones dead
     let deadBlack;
     // Dead black
     for (let i = 0; i < playedBlack.length; i++) {
         deadBlack = playedBlack[i];
         deadBlack.addEventListener('click', (evt) => {
            evt.target.toggleAttribute('class', 'dead-black');
            evt.target.removeEventListener('pointerout', hoverOutFeature);
            evt.target.removeEventListener('pointerenter', hoverInFeature);
            evt.target.innerText = 'dead';
            undoDead();
         });
     }
     // Dead white
     let deadWhite;
     for (let i = 0; i < playedWhite.length; i++) {
         deadWhite = playedWhite[i];
         deadWhite.addEventListener('click', (evt) => {
            evt.target.removeEventListener('pointerout', hoverOutFeature);
            evt.target.removeEventListener('pointerenter', hoverInFeature);
            evt.target.toggleAttribute('class', 'dead-white');
            evt.target.innerText = 'dead';
            undoDead();
         });
     }

}