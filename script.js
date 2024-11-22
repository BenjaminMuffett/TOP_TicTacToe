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
        board.assignValue(row, column, getActivePlayer().value)
        let checkBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()));
        let winStatus = false;

        horizontalCheck = () => {
            if (checkBoard[row].every(value => value === checkBoard[row][0])) {
                console.log(`${getActivePlayer().name} is the winner. Horizontal win.`);
                winStatus = true;
            }
        }

        verticalCheck = () => {
            let inARow = 0;
            for (let i = 0; i < 3; i++) {
                if (checkBoard[i][column] == getActivePlayer().value) {
                    inARow += 1
                }
            }
            if (inARow == 3) {
                console.log(`${getActivePlayer().name} is the winner. Vertical Win.`)
                winStatus = true;
            }
        };

        diagonalCheck = () => {
            if (checkBoard[0][0] == getActivePlayer().value && checkBoard[1][1] == getActivePlayer().value
            && checkBoard[2][2] == getActivePlayer().value ||
            checkBoard[0][2] == getActivePlayer().value && checkBoard[1][1] == getActivePlayer().value
            && checkBoard[2][0] == getActivePlayer().value) {
                console.log(`${getActivePlayer().name} is the winner. Diagonal win.`);
                winStatus = true;
            }
        }

        tieCheck = () => {
            let emptyValue = 0;
            if (checkBoard.every(row => row.every(value =>value > emptyValue )) && winStatus == false) {
                console.log('Game ends in a draw.')
            }

        }

        horizontalCheck();
        diagonalCheck();
        verticalCheck();
        tieCheck();
        switchPlayerTurn();
        printNewRound();
    };


    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard : board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';
        // get up-to-date board & active player info
        const currentBoard = game.getBoard();
        const currentPlayer = game.getActivePlayer();
        // render players turn in turn div
        playerTurnDiv.textContent = `${currentPlayer.name}'s turn.`;

        // render each square grid to the DOM
        currentBoard.forEach(row => {
            row.forEach((cell, index) => {
                const cellButton =document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.column = index;
                cellButton.dataset.row = row;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);

            })
            
        });
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn =e.target.dataset.column;


        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}


ScreenController();