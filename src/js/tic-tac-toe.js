// EVENT HANDLERS 
// ===========================================================================================================

// Setting the X and the O
// =======================
function setPlayer(playerSetup) {
    if (game.movesLeft < 9) {
        return;
    }
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
    buttonClicked.css('background', '#2c2c2c').
        css('color', 'white').
        css('border', 'solid 1px white');
}

function setComputerButtonColors(buttonOther) { /* Use cssText method */
    buttonOther.css('background', 'white').
        css('color', '#2c2c2c').
        css('border', 'solid 1px transparent');
}

// Handling the tic tac toe grid
// =============================
$('.tic-tac-toe-grid .col-4').on('click', function (e) {
    debugger;
    if (game.playerTurn !== 'computerSign') {
        if (game.winner === '') {
            let fieldNumber = parseInt(e.target.id);
            game.gridArray[fieldNumber - 1] = game.playerSign;
            $('#' + fieldNumber).text(game.playerSign);
            checkForWinner(fieldNumber, 'playerSign');
            game.playerTurn = 'computerSign';
            updateFieldsAndMovesLeft(); // Updates the situation of the game
            makeWinningMove(); // Checks if there are possible winning moves
            preventPlayerFromWinning(); // Checks if it should prevent the player from making a winning move
            setTimeout(function () {
                pickRandomField();
            }, 500);
            /* checkForWinner(fieldNumber, 'playerSign'); */
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
    movesLeft: 9, // Number of moves left in the game
    winner: '',
    playerScore: function () {
        return localStorage.getItem('playerScore');

    },
    computerScore: function () {
        return localStorage.getItem('computerScore');
    },
    showStatistics: function () {
        let playerWins = localStorage.getItem('playerScore');
        let computerWins = localStorage.getItem('computerScore');
        window.alert('Player wins: ' + playerWins + ', Computer wins: ' + computerWins);
    }
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
    if (game.playerTurn === 'computerSign') {
        let min = 0;
        let max = game.movesLeft - 1;
        let randomFieldIndex = Math.floor(Math.random() * (max - min + 1)) + min; // Random Number between min and max letiables
        let randomFieldLeft = game.fieldsLeft[randomFieldIndex];
        game.gridArray[randomFieldLeft - 1] = game.computerSign;
        updateFieldsAndMovesLeft();
        $('#' + randomFieldLeft).text(game.computerSign);
        game.playerTurn = 'playerSign';
    }
}

// Winning Algorithm

function winningSchemeBuilder(sign) { // What a big fucking if statement !
    if (game.gridArray[0] === game[sign] && game.gridArray[1] === game[sign] && game.gridArray[2] === game[sign] || // first row
        game.gridArray[3] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[5] === game[sign] || // second row
        game.gridArray[6] === game[sign] && game.gridArray[7] === game[sign] && game.gridArray[8] === game[sign] || // third row
        game.gridArray[0] === game[sign] && game.gridArray[3] === game[sign] && game.gridArray[6] === game[sign] || // first column
        game.gridArray[1] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[7] === game[sign] || // second column
        game.gridArray[2] === game[sign] && game.gridArray[5] === game[sign] && game.gridArray[8] === game[sign] || // third column
        game.gridArray[0] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[8] === game[sign] || // diagonal topleft - bottomright
        game.gridArray[2] === game[sign] && game.gridArray[4] === game[sign] && game.gridArray[6] === game[sign]) { // diagonal topright - bottomleft
        return true;
    } else {
        return false;
    }
}

function checkForWinner(lastMove, currentPlayer) {
    let winningScheme = winningSchemeBuilder(currentPlayer);
    if (winningScheme) {
        game.lastMove = lastMove;
        
        if ( game.playerTurn === currentPlayer) {
            game.winner = currentPlayer;
        }

    }
    declareWinner();
}

function declareWinner() {

    /* Keep track of the total score */

    if (game.winner === 'Computer') {
        let computerPoints = parseInt(game.computerScore());
        computerPoints++;
        localStorage.setItem('computerScore', computerPoints);
    } else if (game.winner === 'Player') {
        let playerPoints = parseInt(game.playerScore());
        playerPoints++;
        localStorage.setItem('playerScore', playerPoints);
    };

    if (game.winner !== '') {
        window.alert(game.winner + ' wins!');
        toggleModalWindow();
    } else if (game.winner === '' && game.movesLeft === 0) {
        window.alert('It is a tie!');
        toggleModalWindow();
    }
}

function resetGame() {
    game.playerTurn = '';
    game.gridArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    game.gridArray.forEach(function (x) {
        $('#' + x).text('');
    }); /* This function should fire after the user clicks 'play another game' in the modal window */
    game.fieldsLeft = [];
    game.lastMove = '';
    game.movesLeft = 9;
    game.winner = '';
    console.log('Game is reset!');
    /* I should have somehow made a copy of the state of the game object when the app is initialized  */
}

function toggleModalWindow() {
    $('#exampleModal').modal('toggle')
}

/* MAIN ALGORITHM */
/* ============== */

// pickRandomField needs to become pickBestField // maybe later

// There needs to be a function that gives an aproximation of chances for user to win and computer to win // maybe later

/* THE AI ALGORITHM */

function makeWinningMove() { // function should check if there is a possible winning move

    if (game.playerTurn === 'computerSign') {

        /* These are some letiables to be used if there is no break; in the for loop */
        let numberOfWinningMoves = 0;
        let arrayOfWinningMoves = [];

        for (let i = 0; i <= game.fieldsLeft.length; i++) {
            let currentFieldObserved = game.fieldsLeft[i];

            game.gridArray[currentFieldObserved - 1] = game.computerSign;
            checkForWinner(currentFieldObserved - 1, 'computerSign');
            if (game.lastMove !== '') {
                numberOfWinningMoves++;
                if (numberOfWinningMoves === 1) {
                    game.gridArray[currentFieldObserved - 1] = game.computerSign;
                    let winningField = game.lastMove + 1;
                    $('#' + winningField).text(game.computerSign);
                    game.playerTurn = 'playerSign';
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

    if (game.playerTurn === 'computerSign') {

        for (let i = 0; i <= game.fieldsLeft.length; i++) {
            let currentFieldObserved = game.fieldsLeft[i];

            game.gridArray[currentFieldObserved - 1] = game.playerSign;
            checkForWinner(currentFieldObserved - 1, 'playerSign');

            if (game.lastMove !== '') {
                game.gridArray[currentFieldObserved - 1] = game.computerSign;
                let winningField = game.lastMove + 1;
                $('#' + winningField).text(game.computerSign);
                game.lastMove = '';
                game.playerTurn = 'playerSign';
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

// THE GAME MUST STOP ONCE ANY PLAYER WINS, NOT A SINGLE MOVE CAN BE PLAYED AFTERWARDS

// THE PLAYER SHOULD NOT BE ABLE TO SWITCH SIGNS ONCE THE GAME HAS STARTED

// IF THE COMPUTER WINS THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU LOOSE!' ; THEN THE GAME SHOULD RESTART

// IF THE GAME IS A TIE , THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'A TIE!' ; THEN THE GAME SHOULD RESTART

// IF YOU WIN, THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU WIN!'; THEN THE GAME SHOULD RESTART

// THE GAME SHOULD RESET 3 SECONDS AFTER AND SAY - PLAY ANOTHER GAME ? YES - NO (MAYBE A MODAL WINDOW)

// COMPUTER SHOULD START THE GAME , WHEN HE IS X, AND TRY TO WIN IT

/* EXAMPLE OF A CLOSURE */

function closureThing() {
    let myVar = false;
    return function () {
        myVar = !myVar;
        console.log(myVar);
    }
}

// Hello

let stuff = closureThing(); // Closure toggles true and false

/* This is just for testing purposes */