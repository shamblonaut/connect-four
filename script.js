class Player {
  constructor(name, piece) {
    this.name = name;
    this.piece = piece;
    this.score = 0;
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

  const getBoard = () => board;
  const getPlayers = () => players;
  const getCurrentPlayer = () => currentPlayer;
  const getSize = () => size;
  const getGameOver = () => gameOver;
  const getWin = () => win;

  const setPlayers = (playerOne, playerTwo) => {
    players = [new Player(playerOne, 1), new Player(playerTwo, 2)];
    currentPlayer = players[0];
  };

  const resetScores = () => {
    if (players.length) {
      players[0].score = 0;
      players[1].score = 0;
    }
  }

  const resetBoard = () => {
    board = [];
    for (let y = 0; y < size.rows; y++) {
      let row = [];
      for (let column = 0; column < size.columns; column++) {
        row.push(0);
      }
      board.push(row);
    }

    gameOver = false;
    currentPlayer = players[0];
  };
  
  const displayBoard = () => {
    // Display the current state of the board in the console
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
            // Backward Diagonal
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
            }
            // Vertical
            else if (
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
            }
            // Forward Diagonal
            else if (
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
          // Horizontal
          if (
            column <= 3 &&
            board[row][column] === board[row][column + 1] &&
            board[row][column] === board[row][column + 2] &&
            board[row][column] === board[row][column + 3]
          ) {
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

  const calculateEmptySlot = (column) => {
    let row = size.rows - 1;
    while (row > 0 && board[row][column] !== 0) {
      row--;
    }

    if (row >= 0 && board[row][column] === 0) {
      return row;
    } else if (row === 0) {
      return null;
    }
  };

  const placePiece = (column) => {
    if (!gameOver) {
      const piece = currentPlayer.piece;

      const emptySlot = calculateEmptySlot(column);
      if (emptySlot !== null) {
        board[emptySlot][column] = piece;

        const result = checkBoard(board);
        if (result) {
          gameOver = true;
          win.winner = currentPlayer.name;
          if (win.winner === players[0].name) {
            players[0].score++;
          } else if (win.winner === players[1].name) {
            players[1].score++;
          }
          return win.winner;
        }
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
      }

      // displayBoard();
    }
  };

  return {
    displayBoard,
    setPlayers,
    placePiece,
    resetScores,
    resetBoard,
    getBoard,
    getPlayers,
    getCurrentPlayer,
    getSize,
    getGameOver,
    getWin,
  };
})();

const displayController = (() => {
  // Display Wrappers
  const frontPageWrapper = document.querySelector(".front-page");
  const gamePageWrapper = document.querySelector(".game-page");
  const endPageWrapper = document.querySelector(".end-page");
  const computerNamesWrapper = document.querySelector(".naming-page.computer");
  const friendNamesWrapper = document.querySelector(".naming-page.friend");
  
  // Forms
  const computerNamesForm = computerNamesWrapper.firstElementChild;
  const friendNamesForm = friendNamesWrapper.firstElementChild;

  // Buttons
  const computerButton = document.querySelector(".mode.computer");
  const friendButton = document.querySelector(".mode.friend");
  const computerPlayButton = document.querySelector(".play.computer");
  const friendPlayButton = document.querySelector(".play.friend");
  const backButtons = document.querySelectorAll(".back");
  const resetButton = document.querySelector(".reset");
  const restartButton = document.querySelector(".restart");

  const gameBoardContainer = document.querySelector(".board");
  const turnIndicator = document.querySelector(".info");
  const resultContainer = document.querySelector(".result");
  const scoreEntries = document.querySelectorAll(".entry");

  const changeDisplayWrapper = (previousWrapper, newWrapper) => {
    previousWrapper.style.display = "none";
    newWrapper.style.display = "";
  };

  const displayFrontPage = () => {
    changeDisplayWrapper(computerNamesWrapper, frontPageWrapper);
    changeDisplayWrapper(friendNamesWrapper, frontPageWrapper);
    changeDisplayWrapper(gamePageWrapper, frontPageWrapper);
    changeDisplayWrapper(endPageWrapper, frontPageWrapper);
  };

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
          turnIndicator.textContent = `${game.getCurrentPlayer().name}'s turn`;
        }
      }
    }
  };

  const checkGameState = (winner) => {
    if (game.getGameOver()) {
      if (winner) {
        let connection = game.getWin().connection;
        for (let pos = 0; pos < connection.length; pos++) {
          gameBoardContainer
            .children[connection[pos][0]]
            .children[connection[pos][1]]
            .firstChild.classList.add("won");
        }
        resultContainer.textContent = `${game.getWin().winner} won the game!`;
      } else {
        resultContainer.textContent = "The game ended in a draw";
      }

      
      scoreEntries[0].children[0].textContent = game.getPlayers()[0].name;
      scoreEntries[0].children[1].textContent = game.getPlayers()[0].score;
      scoreEntries[1].children[0].textContent = game.getPlayers()[1].name;
      scoreEntries[1].children[1].textContent = game.getPlayers()[1].score;

      setTimeout(() => {
        changeDisplayWrapper(gamePageWrapper, endPageWrapper);
      }, 2.5 * 1000);
    }
  };

  // Event Listeners
  computerButton.addEventListener("click", () => {
    computerNamesForm.reset();
    changeDisplayWrapper(frontPageWrapper, computerNamesWrapper);
  });
  
  friendButton.addEventListener("click", () => {
    friendNamesForm.reset();
    changeDisplayWrapper(frontPageWrapper, friendNamesWrapper);
  });

  computerPlayButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(computerNamesForm);

    const playerTurn = form.get("player-type");
    const playerName = form.get("player-name")
      ? form.get("player-name")
      : "Player";
    if (playerTurn === "one") {
      game.setPlayers(playerName, "Computer");
    } else if (playerTurn === "two") {
      game.setPlayers("Computer", playerName);
    }

    changeDisplayWrapper(computerNamesWrapper, gamePageWrapper);
    game.resetBoard();
    updateBoard();
  });

  friendPlayButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(friendNamesForm);

    const playerOneName = form.get("player-one")
      ? form.get("player-one")
      : "Player 1";
    const playerTwoName = form.get("player-two")
      ? form.get("player-two")
      : "Player 2";
    game.setPlayers(playerOneName, playerTwoName);

    changeDisplayWrapper(friendNamesWrapper, gamePageWrapper);
    game.resetBoard();
    updateBoard();
  });

  backButtons.forEach((backButton) => {
    backButton.addEventListener("click", (event) => {
      event.preventDefault();
      game.resetScores();
      displayFrontPage();
    });
  });

  resetButton.addEventListener("click", () => {
    if (!game.getGameOver()) {
      game.resetBoard();
      updateBoard();
    }
  });

  restartButton.addEventListener("click", () => {
    game.resetBoard();
    updateBoard();
    changeDisplayWrapper(endPageWrapper, gamePageWrapper);
  });

  // Initial setups
  displayFrontPage();

  // Setup up the game board
  for (let row = 0; row < game.getSize().rows; row++) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    for (let column = 0; column < game.getSize().columns; column++) {
      const squareContainer = document.createElement("button");
      squareContainer.classList.add("square");

      squareContainer.addEventListener("click", () => {
        if (!game.getGameOver()) {
          const winner = game.placePiece(column);
          updateBoard();
          checkGameState(winner);
        }
      });

      rowContainer.appendChild(squareContainer);
    }
    gameBoardContainer.appendChild(rowContainer);
  }
})();
