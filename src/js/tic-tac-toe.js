// EVENT HANDLERS 
// ===========================================================================================================

/* Initiating the app */

$(document).ready(function () {
    /* Setting the statistics for the session */
    localStorage.setItem('playerScore', '0');
    localStorage.setItem('computerScore', '0');
    localStorage.setItem('ties', '0');
});

// Setting the userSign and computerSign
// =======================

function setPlayerSign(playerSetup) {
    if (game.movesLeft === 9) {
        game.playerSign = playerSetup;
        // Changing the color of the buttons
        let x = $('#X');
        let o = $('#O');
        if (game.playerSign === "X") {
            setUserButtonColors(x, o);
        } else if (game.playerSign === "O") {
            setUserButtonColors(o, x);
        }
        setComputerSign();
    }
}

function setComputerSign() {
    if (game.playerSign === 'X') {
        game.computerSign = 'O';
    } else {
        game.computerSign = 'X';
    }
}

// Setting the colors of user and computer
// =========================================

function setUserButtonColors(buttonClicked, buttonOther) {
    if (!buttonClicked.hasClass('btn-user')) {
        buttonClicked.addClass('btn-user');
        buttonOther.removeClass('btn-user');
    }
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
            pickRandomField();
            checkForWinner(game.lastMove, 'computerSign');
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
    fieldsLeft: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], // Fields that have still not been used in the game
    movesLeft: 9, // Number of moves left in the game
    winner: '',
    playerScore: function () {
        return localStorage.getItem('playerScore');

    },
    computerScore: function () {
        return localStorage.getItem('computerScore');
    },
    tieScore: function () {
        return localStorage.getItem('ties');
    },
    showStatistics: function () {
        let playerWins = localStorage.getItem('playerScore');
        let computerWins = localStorage.getItem('computerScore');
        let ties = localStorage.getItem('ties');
        window.alert('Player wins: ' + playerWins + ', Computer wins: ' + computerWins + ' Ties: ' + ties);
    }
}

function startGameByComputer() {
    game.playerTurn = 'computerSign';
    pickRandomField();
}

function updateFieldsAndMovesLeft() {
    game.fieldsLeft = game.gridArray.filter(function (field) {
        return field !== 'X' && field !== 'O';
    });
    game.movesLeft = game.fieldsLeft.length;
}

function pickRandomField() {
    if (game.playerTurn === 'computerSign' && game.winner === '') {
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

function checkForWinner(fieldPlayed, currentPlayer) {
    if (game.winner === '') {
        let winningScheme = winningSchemeBuilder(currentPlayer);
        if (winningScheme) {
            game.lastMove = fieldPlayed;

            if (game.playerTurn === currentPlayer) {
                game.winner = currentPlayer;
            }

        }
        declareWinner();
    }
}

function declareWinner() {

    /* Declare winner or tie */

    if (game.winner !== '') {
        setTimeout(function () {
            window.alert(game.winner + ' wins!');
            toggleModalWindow();
        }, 300);

    } else if (game.winner === '' && game.movesLeft === 0) {
        game.winner = 'Tie';
        setTimeout(function () {
            window.alert('It is a tie!');
            toggleModalWindow();
        }, 300);
    }

    /* Keep track of the total score */
    debugger;
    if (game.winner === 'computerSign') {
        let computerPoints = parseInt(game.computerScore());
        computerPoints++;
        localStorage.setItem('computerScore', computerPoints);
    } else if (game.winner === 'playerSign') {
        let playerPoints = parseInt(game.playerScore());
        playerPoints++;
        localStorage.setItem('playerScore', playerPoints);
    } else if (game.winner === 'Tie') {
        let tiePoints = parseInt(game.tieScore());
        tiePoints++;
        localStorage.setItem('ties', tiePoints);
    };
}

function resetGame() {
    game.playerTurn = '';
    game.gridArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    game.gridArray.forEach(function (x) {
        $('#' + x).text('');
    }); /* This function should fire after the user clicks 'play another game' in the modal window */
    game.fieldsLeft = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    game.lastMove = '';
    game.movesLeft = 9;
    game.winner = '';
    console.log('Game is reset!');
}

function toggleModalWindow() {
    $('#exampleModal').modal('toggle')
}

/* THE AI ALGORITHM */
/* ================ */

function makeWinningMove() { // function should check if there is a possible winning move

    if (game.playerTurn === 'computerSign' && game.winner === '') {

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

    if (game.playerTurn === 'computerSign' && game.winner === '') {

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

// COMPUTER SHOULD START THE GAME , WHEN HE IS X, AND TRY TO WIN IT

// IF THE COMPUTER WINS THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU LOOSE!' ; THEN THE GAME SHOULD RESTART

// IF THE GAME IS A TIE , THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'A TIE!' ; THEN THE GAME SHOULD RESTART

// IF YOU WIN, THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU WIN!'; THEN THE GAME SHOULD RESTART