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
        if (board[row][column].getValue() === '') {
            board[row][column].addValue(player);
        } else {
            console.log('Has already been taken.');
            throw new Error('Stop player change')
        }
    }

    const printBoard = () => {
        boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues);
    }

    return {getBoard, assignValue, printBoard};
}

function Cell() {
    let value = '';

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
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            value: 'X'
        },
        {
            name: playerTwoName,
            value: 'O'
        }
    ];

    let activePlayer = players[0];

    function getPlayerName(index) {
        return players[index].name
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    let winStatus ='';

    const getStatus = () => winStatus;

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} places ${getActivePlayer().value} in ${row}, ${column}.`);
        board.assignValue(row, column, getActivePlayer().value)
        let checkBoard = board.getBoard().map((row) => row.map((cell) => cell.getValue()));

        horizontalCheck = () => {
            if (checkBoard[row].every(value => value === checkBoard[row][0])) {
                console.log(`${getActivePlayer().name} is the winner. Horizontal win.`);
                return winStatus = true;
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
                return winStatus = true;
            }
        };

        diagonalCheck = () => {
            if (checkBoard[0][0] == getActivePlayer().value && checkBoard[1][1] == getActivePlayer().value
            && checkBoard[2][2] == getActivePlayer().value ||
            checkBoard[0][2] == getActivePlayer().value && checkBoard[1][1] == getActivePlayer().value
            && checkBoard[2][0] == getActivePlayer().value) {
                console.log(`${getActivePlayer().name} is the winner. Diagonal win.`);
                return winStatus = true;
            }
        }

        tieCheck = () => {
            let emptyValue = '';
            if (checkBoard.every(row => row.every(value =>value > emptyValue )) && winStatus == false) {
                console.log('Game ends in a draw.')
                return winStatus = false;
            }

        }

        const result = () => {
            horizontalCheck();
            diagonalCheck();
            verticalCheck();
            tieCheck();
        }

        // horizontalCheck();
        // diagonalCheck();
        // verticalCheck();
        // tieCheck();
        result();
        if (winStatus == '') {
            switchPlayerTurn();
            printNewRound();
        };
        
        
    };



    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard : board.getBoard,
        getStatus,
        getPlayerName
    };
}

function ScreenController() {
    var game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resultsDiv = document.querySelector('.results');
    const startBtn = document.querySelector('.startBtn');
    const resetBtn = document.querySelector('.resetBtn');

    const updateScreen = () => {
        boardDiv.textContent = '';
        // get up-to-date board & active player info
        const currentBoard = game.getBoard();
        const currentPlayer = game.getActivePlayer();
        // render players turn in turn div
        playerTurnDiv.textContent = `${currentPlayer.name}'s turn.`;

        // render each square grid to the DOM
        currentBoard.forEach((row, idx) => {
            row.forEach((cell, index) => {
                const cellButton =document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.column = index;
                cellButton.dataset.row = idx;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
            
        });
        const currentStatus = game.getStatus();
        if (currentStatus) {
            resultsDiv.textContent = `${currentPlayer.name} wins!`;
        } else if (currentStatus === false) {
            resultsDiv.textContent ='Game ends in a draw.';
        };
        
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn =e.target.dataset.column;
        const currentStatus = game.getStatus();
        if (currentStatus === '') {
            game.playRound(selectedRow,selectedColumn);
            updateScreen();
        }   
    }

    function clickStartButton(e) {
        const playerOne = prompt("Please enter player one's name.", 'Player One');
        const playerTwo = prompt("Please enter player two's name.", 'Player Two');
        game = GameController(playerOne, playerTwo);
        updateScreen();
        resultsDiv.textContent = '';
    }

    function clickResetButton(e) {
        game = GameController(game.getPlayerName(0), game.getPlayerName(1));
        updateScreen();
        resultsDiv.textContent ='';
        
    }

    boardDiv.addEventListener('click', clickHandlerBoard);
    startBtn.addEventListener('click', clickStartButton);
    resetBtn.addEventListener('click', clickResetButton);

    updateScreen();
}


ScreenController();