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
  let win = {};

  let gameOver = false;

  for (let y = 0; y < size.rows; y++) {
    let row = [];
    for (let column = 0; column < size.columns; column++) {
      row.push(0);
    }
    board.push(row);
  }

  const getBoard = () => board;
  const getCurrentPlayer = () => currentPlayer;
  const getSize = () => size;
  const getGameOver = () => gameOver;
  const getWin = () => win;

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
    let filled = true;
    for (let row = 0; row < size.rows; row++) {
      for (let column = 0; column < size.columns; column++) {
        if (board[row][column] === 0) {
          filled = false;
        } else {
          if (row > 2) {
            if (
              column > 2 &&
              board[row][column] === board[row - 1][column - 1] &&
              board[row][column] === board[row - 2][column - 2] &&
              board[row][column] === board[row - 3][column - 3]
            ) {
              win.connection = [
                [row, column],
                [row - 1, column - 1],
                [row - 2, column - 2],
                [row - 3, column - 3],
              ];
              return 1;
            } else if (
              board[row][column] === board[row - 1][column] &&
              board[row][column] === board[row - 2][column] &&
              board[row][column] === board[row - 3][column]
            ) {
              win.connection = [
                [row, column],
                [row - 1, column],
                [row - 2, column],
                [row - 3, column],
              ];
              return 1;
            } else if (
              board[row][column] === board[row - 1][column + 1] &&
              board[row][column] === board[row - 2][column + 2] &&
              board[row][column] === board[row - 3][column + 3]
            ) {
              win.connection = [
                [row, column],
                [row - 1, column + 1],
                [row - 2, column + 2],
                [row - 3, column + 3],
              ];
              return 1;
            }
          }
          if (
            column < 2 &&
            board[row][column] === board[row][column + 1] &&
            board[row][column] === board[row][column + 2] &&
            board[row][column] === board[row][column + 3]
          ) {
            win.connection = [
              board[row][column],
              board[row][column + 1],
              board[row][column + 2],
              board[row][column + 3],
            ];
            win.connection = [
              [row, column],
              [row, column + 1],
              [row, column + 2],
              [row, column + 3],
            ];
            return 1;
          }
        }
      }
    }

    if (filled) return -1;
  };

  const placePiece = (column) => {
    if (!gameOver) {
      const piece = currentPlayer.piece;
      let row = board.length - 1;
      while (row > 0 && board[row][column] !== 0) {
        row--;
      }
      if (row >= 0 && board[row][column] === 0) {
        board[row][column] = piece;

        const result = checkBoard(board);
        if (result) {
          gameOver = true;
          return `${currentPlayer.name} won the game!`;
        }
      }

      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
      // displayBoard();
    }
  };

  setPlayers(new Player("Shamblonaut", 1), new Player("Thamidu", 2));

  return {
    displayBoard,
    setPlayers,
    placePiece,
    getBoard,
    getCurrentPlayer,
    getSize,
    getGameOver,
    getWin,
  };
})();

const displayController = (() => {
  const gameBoardContainer = document.querySelector(".board");
  const infoContainer = document.querySelector(".info");

  const updateBoard = () => {
    for (let row = 0; row < game.getSize().rows; row++) {
      const rowContainer = gameBoardContainer.children[row];
      for (let column = 0; column < game.getSize().columns; column++) {
        const squareContainer = rowContainer.children[column];
        if (squareContainer.hasChildNodes()) {
          squareContainer.removeChild(squareContainer.children[0]);
        }

        const piece = game.getBoard()[row][column];
        if (piece !== 0) {
          const pieceContainer = document.createElement("div");
          pieceContainer.classList.add("piece");

          if (piece === 1) pieceContainer.classList.add("one");
          else if (piece === 2) pieceContainer.classList.add("two");

          squareContainer.appendChild(pieceContainer);
        }

        if (!game.getGameOver()) {
          infoContainer.textContent = `${game.getCurrentPlayer().name}'s turn`;
        }
      }
    }
  };

  // Setup up the game board
  for (let row = 0; row < game.getSize().rows; row++) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    for (let column = 0; column < game.getSize().columns; column++) {
      const squareContainer = document.createElement("button");
      squareContainer.classList.add("square");

      squareContainer.addEventListener("click", () => {
        const result = game.placePiece(column);
        updateBoard();

        if (game.getGameOver() && result) {
          infoContainer.textContent = result;
          let connection = game.getWin().connection;
          for (let pos = 0; pos < connection.length; pos++) {
            gameBoardContainer
              .children[connection[pos][0]]
              .children[connection[pos][1]]
              .firstChild
              .style["background-color"] = "#16a34a";
          }
        }
      });

      rowContainer.appendChild(squareContainer);
    }
    gameBoardContainer.appendChild(rowContainer);
  }
  updateBoard();

  return {
    gameBoardContainer,
  };
})();
