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
    assignComputerSign();
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
    debugger;
    if (game.playerTurn !== 'computer') {
        if (game.winner === '') {
            var fieldNumber = parseInt(e.target.id);
            $('#' + fieldNumber).text(game.playerSign);
            game.gridArray[fieldNumber - 1] = game.playerSign;
            game.playerTurn = 'computer';
            updateFieldsAndMovesLeft(); // Updates the situation of the game
            makeWinningMove(); // Checks if there are possible winning moves
            preventPlayerFromWinning(); // Checks if it should prevent the player from making a winning move
            setTimeout(function () {
                pickRandomField();
            }, 500);
            checkForWinner(fieldNumber, 'playerSign');
            checkForWinner(game.lastMove, 'computerSign');
            /* declareWinner(); */

        } else {
            window.alert('The game is over! No more playing!');
        }
    }

});

// ===========================================================================================================

// THE MAIN GAME OBJECT
// ====================

let game = {
    playerSign: 'X',
    computerSign: 'O',
    playerTurn: '',
    gridArray: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], // Tic Tac Toe fields placeholder,
    lastMove: '',
    arrayOfWinningMoves: [],
    fieldsLeft: [], // Fields that have still not been used in the game
    movesLeft: 0, // Number of moves left in the game
    winner: ''
}

function assignComputerSign() {
    if (game.playerSign === 'X') {
        game.computerSign = 'O';
    } else {
        game.computerSign = 'X';
    }
}

function updateFieldsAndMovesLeft() {
    game.fieldsLeft = game.gridArray.filter(function (field) {
        return field !== 'X' && field !== 'O';
    });
    game.movesLeft = game.fieldsLeft.length;
}

function pickRandomField() {
    if (game.playerTurn === 'computer') {
        var min = 0;
        var max = game.movesLeft - 1;
        var randomFieldIndex = Math.floor(Math.random() * (max - min + 1)) + min; // Random Number between min and max variables
        var randomFieldLeft = game.fieldsLeft[randomFieldIndex];
        game.gridArray[randomFieldLeft - 1] = game.computerSign;
        updateFieldsAndMovesLeft();
        $('#' + randomFieldLeft).text(game.computerSign);
        game.playerTurn = 'player';
    }
}

// Winning Algorithm

function winningSchemeBuilder(sign) { // this function should have a sign parameter
    if (game.gridArray[0] === game[sign] && game.gridArray[1] === game[sign] && game.gridArray[2] === game[sign] || // What a big fucking if statement
        game.gridArray[3] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[5] === game[sign] ||
        game.gridArray[6] === game[sign] && game.gridArray[7] === game[sign] && game.gridArray[8] === game[sign] ||
        game.gridArray[0] === game[sign] && game.gridArray[3] === game[sign] && game.gridArray[6] === game[sign] ||
        game.gridArray[1] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[7] === game[sign] ||
        game.gridArray[2] === game[sign] && game.gridArray[5] === game[sign] && game.gridArray[8] === game[sign] ||
        game.gridArray[0] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[8] === game[sign] ||
        game.gridArray[2] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[6] === game[sign]) {
        return true;
    } else {
        return false;
    }
}

function checkForWinner(lastMove, currentPlayer) {
    var winningScheme = winningSchemeBuilder(currentPlayer);
    if (winningScheme) {
        declareWinner();
        game.lastMove = lastMove;
    }
}

function declareWinner() {
    if (game.winner !== '') {
        window.alert(game.winner + ' wins!');
    }
}

/* MAIN ALGORITHM */
/* ============== */

// pickRandomField needs to become pickBestField

// There needs to be a function that gives an aproximation of chances for user to win and computer to win

/* THE AI ALGORITHM */

function makeWinningMove() { // function should check if there is a possible winning move

    /* debugger; */

    if (game.playerTurn === 'computer') {

        /* These are some variables to be used if there is no break; in the for loop */
        var numberOfWinningMoves = 0;
        var arrayOfWinningMoves = [];

        for (var i = 0; i <= game.fieldsLeft.length; i++) {
            var currentFieldObserved = game.fieldsLeft[i];

            game.gridArray[currentFieldObserved - 1] = game.computerSign;
            checkForWinner(currentFieldObserved - 1, 'computerSign');
            if (game.lastMove !== '') {
                numberOfWinningMoves++;
                if (numberOfWinningMoves === 1) {
                    game.gridArray[currentFieldObserved - 1] = game.computerSign;
                    let winningField = game.lastMove + 1;
                    $('#' + winningField).text(game.computerSign);
                    game.playerTurn = 'player';
                    game.winner = 'Computer';
                    break;
                }
                arrayOfWinningMoves.push(game.lastMove);
                game.lastMove = '';
            }
            game.gridArray[currentFieldObserved - 1] = game.fieldsLeft[i];
        }
        game.arrayOfWinningMoves = arrayOfWinningMoves;
    }
};

function preventPlayerFromWinning() { // function should stop the player from making a winning move

    if (game.playerTurn === 'computer') {

        for (var i = 0; i <= game.fieldsLeft.length; i++) {
            var currentFieldObserved = game.fieldsLeft[i];

            game.gridArray[currentFieldObserved - 1] = game.playerSign;
            checkForWinner(currentFieldObserved - 1, 'playerSign');

            if (game.lastMove !== '') {
                game.gridArray[currentFieldObserved - 1] = game.computerSign;
                let winningField = game.lastMove + 1;
                $('#' + winningField).text(game.computerSign);
                game.lastMove = '';
                game.playerTurn = 'player';
                break;
            }
            game.gridArray[currentFieldObserved - 1] = game.fieldsLeft[i];
        }
    }
}

// There should be a function that calculates the chance of the situation on the grid
// - If there is gridArray[0] and gridArray[8] , there should be a better chance (more points) because it matches winning more winningScheme builder lines 

/* THINGS TO BE DONE */
//====================

// IF THE COMPUTER WINS THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU LOOSE!'
// IF THE COMPUTER WINS, THE SCREEN AROUND THE TIC TAC TOE GRID SHOULD SAY (WHISPER) LOOSER ... LOOSER ... LOOSER ... 

// IF THE GAME IS A TIE , THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'A TIE!'

// THE GAME SHOULD RESET 3 SECONDS AFTER

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

// Hello

var stuff = closureThing(); // Closure toggles true and false

/* This is just for testing purposes */