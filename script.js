console.log("Welcome to Connect Four!");

class Player {
  constructor(name, piece) {
    this.name = name;
    this.piece = piece;
  }
}

const game = (() => {
  let board = [];
  let size = {
    rows: 6,
    columns: 7,
  };
  let players = [];
  let currentPlayer;

  let gameOver = false;

  for (let y = 0; y < size.rows; y++) {
    let row = [];
    for (let column = 0; column < size.columns; column++) {
      row.push(0);
    }
    board.push(row);
  }

  const getGameOver = () => gameOver;

  const setPlayers = (playerOne, playerTwo) => {
    players = [playerOne, playerTwo];
    currentPlayer = players[0];
  };

  const displayBoard = () => {
    let output = "";
    for (let row = 0; row < size.rows; row++) {
      output += board[row].join(" ") + "\n";
    }
    console.log(output);
  };

  const checkBoard = (board) => {
    for (let row = 0; row < size.rows; row++) {
      for (let column = 0; column < size.columns; column++) {
        if (board[row][column] !== 0) {
          if (
            (row > 2 &&
              ((column > 2 &&
                board[row][column] === board[row - 1][column - 1] &&
                board[row][column] === board[row - 2][column - 2] &&
                board[row][column] === board[row - 3][column - 3]) ||
                (board[row][column] === board[row - 1][column] &&
                  board[row][column] === board[row - 2][column] &&
                  board[row][column] === board[row - 3][column]) ||
                (board[row][column] === board[row - 1][column + 1] &&
                  board[row][column] === board[row - 2][column + 2] &&
                  board[row][column] === board[row - 3][column + 3]))) ||
            (column < 2 &&
              board[row][column] === board[row][column + 1] &&
              board[row][column] === board[row][column + 2] &&
              board[row][column] === board[row][column + 3])
          ) {
            return board[row][column];
          }
        }
      }
    }
  };

  const placePiece = (column) => {
    const piece = currentPlayer.piece;
    let row = board.length - 1;
    while (row > 0 && board[row][column] !== 0) {
      row--;
    }
    if (row >= 0 && board[row][column] === 0) {
      board[row][column] = piece;
    }
    
    const result = checkBoard(board);
    if(result) {
      gameOver = true;
      console.log(`${currentPlayer.name} won the game!`);
    }

    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    displayBoard();
  };

  

  setPlayers(new Player("Shamblonaut", 1), new Player("Thamidu", 2));

  return {
    displayBoard,
    setPlayers,
    placePiece,
    getGameOver,
  };
})();
