// EVENT HANDLERS 
// ===========================================================================================================

// Setting the X and the O
// =======================
function setPlayer(playerSetup) {
    game.playerSign = playerSetup;
    // Changing the color of the buttons
    let x = $('#X');
    let o = $('#O');
    if (game.playerSign === "X") {
        setUserButtonColors(x);
        setComputerButtonColors(o);
    } else if (game.playerSign === "O") {
        setUserButtonColors(o);
        setComputerButtonColors(x);
    }
    game.assignComputerSign();
}
// Setting the colors of player and computer
// =========================================
function setUserButtonColors(buttonClicked) {
    buttonClicked.css('background', '#2c2c2c'). // how to set #2c2c2c to be $blackboard?
    css('color', 'white').
    css('border', 'solid 1px white');
}

function setComputerButtonColors(buttonOther) {
    buttonOther.css('background', 'white').
    css('color', '#2c2c2c').
    css('border', 'solid 1px transparent');
}

// Handling the tic tac toe grid
// =============================
$('.tic-tac-toe-grid .col-4').on('click', function (e) {
    var fieldNumber = parseInt(e.target.id);
    $('#' + fieldNumber).text(game.playerSign);
    // Doing the game Algorithm
    gridArray[fieldNumber - 1] = game.playerSign;
    updateFieldsLeft();
    checkWinningMoves(); // This is the function I should check#
    /* debugger; */
    if (game.arrayOfWinningMoves.length !== 0) {
        let winningField = game.arrayOfWinningMoves[0];
        gridArray[winningField] = game.computerSign;
        updateFieldsLeft();
        let winningFieldId = winningField + 1;
        $('#' + winningFieldId).text(game.computerSign);
    } else {
        setTimeout(function () {
            pickRandomField();
        }, 500);
    }
    checkForWinner(fieldNumber);
});

// ===========================================================================================================

// THE MAIN GAME OBJECT
// ====================

let game = {
    playerSign: 'X',
    computerSign: 'O',
    assignComputerSign: function () {
        if (this.playerSign === 'X') {
            this.computerSign = 'O';
        } else {
            this.computerSign = 'X';
        }
    },
    lastMove: '',
    arrayOfWinningMoves: []
}

// Game Algorithm

var gridArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; // Tic Tac Toe fields placeholder

var fieldsLeft; // Fields that have still not been used
var movesLeft; // Moves left in the game

function updateFieldsLeft() {
    fieldsLeft = gridArray.filter(function (field) {
        return field !== 'X' && field !== 'O';
    });
    movesLeft = fieldsLeft.length;
}

function pickRandomField() {
    var min = 0;
    var max = movesLeft - 1;
    var randomFieldIndex = Math.floor(Math.random() * (max - min + 1)) + min; // Random Number between min and max variables
    var randomFieldLeft = fieldsLeft[randomFieldIndex];
    gridArray[randomFieldLeft - 1] = game.computerSign;
    updateFieldsLeft();
    $('#' + randomFieldLeft).text(game.computerSign);
}

// Winning Algorithm

function winningSchemeBuilder(sign) { // this function should have a sign parameter
    if (gridArray[0] === game[sign] && gridArray[1] === game[sign] && gridArray[2] === game[sign] || // What a big fucking if statement
        gridArray[3] === game[sign] && gridArray[4] === game[sign] && gridArray[5] === game[sign] ||
        gridArray[6] === game[sign] && gridArray[7] === game[sign] && gridArray[8] === game[sign] ||
        gridArray[0] === game[sign] && gridArray[3] === game[sign] && gridArray[6] === game[sign] ||
        gridArray[1] === game[sign] && gridArray[4] === game[sign] && gridArray[7] === game[sign] ||
        gridArray[2] === game[sign] && gridArray[5] === game[sign] && gridArray[8] === game[sign] ||
        gridArray[0] === game[sign] && gridArray[4] === game[sign] && gridArray[8] === game[sign] ||
        gridArray[2] === game[sign] && gridArray[4] === game[sign] && gridArray[6] === game[sign]) {
        return true;
    } else {
        return false;
    }
}

function checkForWinner(lastMove, currentPlayer) {
    var winningScheme = winningSchemeBuilder(currentPlayer);
    if (winningScheme) {
        window.alert('You lose!');
        game.lastMove = lastMove;
        console.log(game.lastMove);
    }
}


// IF THE COMPUTER WINS THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU LOOSE!'
// IF THE COMPUTER WINS, THE SCREEN AROUND THE TIC TAC TOE GRID SHOULD SAY (WHISPER) LOOSER ... LOOSER ... LOOSER ... 

// IF THE GAME IS A TIE , THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'A TIE!'

// THE GAME SHOULD RESET 3 SECONDS AFTER

/* MAIN ALGORITHM */
/* ============== */

// pickRandomField needs to become pickBestField

// There needs to be a function that gives an aproximation of chances for user to win and computer to win

function checkWinningMoves() { // function should check if there is a possible winning move
    /* debugger; */
    var numberOfWinningMoves = 0;
    var arrayOfWinningMoves = [];
    // Making a copy of the gridArray that should be used over and over again
    var gridArrayBeforeCheck = [];
    gridArray.forEach(function (oldFieldValue) {
        gridArrayBeforeCheck.push(oldFieldValue);
    });

    for (var i = 0; i <= fieldsLeft.length; i++) {
        var currentFieldObserved = fieldsLeft[i];

        gridArray[currentFieldObserved - 1] = game.computerSign;
        checkForWinner(currentFieldObserved - 1, 'computerSign');
        if (game.lastMove !== '') {
            console.log('The winning move is ' + game.lastMove);
            numberOfWinningMoves++;
            arrayOfWinningMoves.push(game.lastMove);
            game.lastMove = '';
        }
        /* else {
                   gridArray[currentFieldObserved - 1] = fieldsLeft[i];
               } */
        gridArray[currentFieldObserved - 1] = fieldsLeft[i]; // Maybe this line of code could replace gridArrayBeforeCheck stuff
    }

    gridArray = gridArrayBeforeCheck; // This part gets the old value of the gridArray,before the check
    console.log('There are ' + numberOfWinningMoves + ' possible winning moves!');
    console.log('Winning fields: ' + arrayOfWinningMoves);
    // I should give an arrayOfWinningMoves to the player object
    game.arrayOfWinningMoves = arrayOfWinningMoves;
};

/* EXAMPLE OF A CLOSURE */

function closureThing() {
    var myVar = false;
    return function () {
        if (myVar === false) {
            myVar = true;
            console.log(myVar);
        } else {
            myVar = false;
            console.log(myVar);
        }
    }
}

var stuff = closureThing(); // Closure toggles true and false