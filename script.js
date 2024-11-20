function Gameboard() {
    // create a 3x3 grid in a 2d array
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const assignValue = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addValue(player);
        } else {
            console.log('Has already been taken.');
        }
    }

    const printBoard = () => {
        boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues);
    }

    return {getBoard, assignValue, printBoard};
}

function Cell() {
    let value = 0;

    addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addValue, 
        getValue
    };
}

function GameController(
    playerOneName = 'P1',
    playerTwoName = 'P2'
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            value: 1
        },
        {
            name: playerTwoName,
            value: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} places ${getActivePlayer().value} in ${row}, ${column}.`);
        board.assignValue(row, column, getActivePlayer().value);
        // winner or tie check
        // tie - no values of 0 left && no three in a row
        // winner full row/col of same value or either diagonal [0,0][1,1][2,2] || [0,2][1,1][2,0] - 8 total
        // let winCheck = (list) => list.every(item => item === list[0]); 
        let checkBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()))
        console.log(checkBoard);
        switchPlayerTurn();
        printNewRound();
    };

    const gameStatus = () => {
        let emptyValue = 0;
        if (board.every > emptyValue) {
            console.log('Game is a tie.')
        }
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();