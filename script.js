const cell = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('#game-status');
const form = document.querySelectorAll('form');

const gameBoard = (function() {
    let board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    const temp = board.map(r => r.slice());
    let gameEnd = false;

    const makeMove = (coords, player) => {
        if (board[coords[0]][coords[1]] == ' ') {
            board[coords[0]][coords[1]] = player.symbol            
        }
        else { return false; }

        // displayBoard();

        result = win(player.symbol);
        if (result) { 
            if (result == 'tie') { gameStatus.textContent = "It's a tie!"; }
            else { gameStatus.textContent = `${player.name} wins!`; } 
            player.wins++;
            gameEnd = true;
            cell.forEach(c => c.style.pointerEvents = 'none');
        }
    }

    // const displayBoard = () => {
    //     console.log(`
    //         ${board[0][0]} | ${board[0][1]} | ${board[0][2]}
    //         ${board[1][0]} | ${board[1][1]} | ${board[1][2]}
    //         ${board[2][0]} | ${board[2][1]} | ${board[2][2]}
    //     `);
    // }

    const win = (symbol) => {
        // Checks every row
        for (let r in board) {
            if (board[r][0] == symbol && board[r][1] == symbol && board[r][2] == symbol) { return true; }
        }

        // Checks every column
        for (let c in board) {
            if (board[0][c] == symbol && board[1][c] == symbol && board[2][c] == symbol) { return true; }
        }
        // Checks diagonals
        if (board[1][1] == symbol && 
            ((board[0][0] == symbol && board[2][2] == symbol)
            || 
            (board[0][2] == symbol) && board[2][0] == symbol)) 
            { return true; }
            
        if (board[0].indexOf(' ') < 0 && board[1].indexOf(' ') < 0 && board[2].indexOf(' ') < 0) { return 'tie'; }
        return false;
    }

    const gameEnded = () => gameEnd;

    const resetGame = () => {
        gameStatus.textContent = `Game restarted! ${playGame.getCurPlayer().name}'s turn (${playGame.getCurPlayer().symbol})`;
        cell.forEach(c => {
            c.textContent = '';
            c.style.pointerEvents = 'all';
        });
        board = temp.map((r) => r.slice());
        gameEnd = false;
    }

    return {makeMove, gameEnded, resetGame}
})();

const Player = function(name, symbol, wins=0) {
    const numWins = () => {
        gameStatus.textContent = `${name} has ${wins} wins`;
    }
    return {numWins, name, symbol}
}

const playGame = (function() {

    const playerOne = Player('player1', 'X');
    const playerTwo = Player('player2', 'O');

    const players = [playerOne, playerTwo];
    let curPlayer = players[0];

    const switchPlayers = () => curPlayer = curPlayer == players[0] ? players[1] : players[0];
    const getCurPlayer = () => curPlayer;


    gameStatus.textContent =`Game started between ${playerOne.name} and ${playerTwo.name}! Currently ${curPlayer.name}'s turn (${curPlayer.symbol})`;

    form.forEach((f) => {
        f.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.name;

            if (input.id[input.id.length-1] == 1) {
                playerOne.name = input.value;
            }
            else {
                playerTwo.name = input.value
            }
            input.value = '';
        })
    });

    cell.forEach(c => {
        c.addEventListener('click', ({target}) => {
            if (target.textContent == '') {
                target.textContent = curPlayer.symbol;
                gameBoard.makeMove([target.id[0], target.id[1]], curPlayer);

                switchPlayers();

                if (!gameBoard.gameEnded()) {
                    gameStatus.textContent = `${curPlayer.name}'s turn (${curPlayer.symbol})`;
                }
            }
            else {
                gameStatus.textContent = `Invalid Move! Still ${curPlayer.name}'s turn`;
            }
        })
    })
    return { getCurPlayer, switchPlayers }

})();

const resetButton = document.querySelector('#reset-game');
resetButton.addEventListener('click', () => {
    gameBoard.resetGame();
})



