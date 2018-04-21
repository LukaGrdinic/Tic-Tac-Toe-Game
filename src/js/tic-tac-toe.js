// Setting the X and the O
// =============================
function setPlayer(playerSetup) {
    player.playerSign = playerSetup;
    // Changing the color of the buttons
    let x = $('#X');
    let o = $('#O');
    if (player.playerSign === "X") {
        setUserButtonColors(x);
        setComputerButtonColors(o);
    } else if (player.playerSign === "O") {
        setUserButtonColors(o);
        setComputerButtonColors(x);
    }
    player.assignComputerSign();
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
// The player Object
// =============================
let player = {
    playerSign: 'X',
    computerSign: 'O',
    assignComputerSign: function () {
        if (this.playerSign === 'X') {
            this.computerSign = 'O';
        } else {
            this.computerSign = 'X';
        }
    }
}

// Handling the tic tac toe grid
// =============================
$('.tic-tac-toe-grid').on('click', function (e) {
    debugger;
    var fieldNumber = parseInt(e.target.id);
    if (fieldNumber !== NaN) {
        $('#' + fieldNumber).text(player.playerSign);
        gridArray[fieldNumber - 1] = player.playerSign;
    }
    // Doing the game Algorithm
    updateFieldsLeft();
    setTimeout(function () {
        pickRandomField();
    }, 500)
});

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
    gridArray[randomFieldLeft - 1] = player.computerSign;
    updateFieldsLeft();
    $('#' + randomFieldLeft).text(player.computerSign);
}


// AFTER THE USER CLICKS, THE COMPUTER TAKES ITS TURN (AI STUFF)

// IF THE COMPUTER WINS THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'YOU LOOSE!'
// IF THE COMPUTER WINS, THE SCREEN AROUND THE TIC TAC TOE GRID SHOULD SAY (WHISPER) LOOSER ... LOOSER ... LOOSER ... 

// IF THE GAME IS A TIE , THERE SHOULD BE A MESSAGE IN THE UPPER RIGHT CORNER THAT SAYS 'A TIE!'

// THE GAME SHOULD RESET 3 SECONDS AFTER