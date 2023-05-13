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
  let difficulty;
  let mode;
  let players = [];
  let currentPlayer;
  let win = {};

  let gameOver = false;

  const getBoard = () => board;
  const getPlayers = () => players;
  const getMode = () => mode;
  const getCurrentPlayer = () => currentPlayer;
  const getSize = () => size;
  const getGameOver = () => gameOver;
  const getWin = () => win;

  const setPlayers = (playerOne, playerTwo) => {
    players = [new Player(playerOne, 1), new Player(playerTwo, 2)];
    currentPlayer = players[0];
  };

  const setDifficulty = (gameDifficulty) => {
    difficulty = gameDifficulty;
  }

  const setMode = (gameMode) => {
    mode = gameMode;
  }

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
              return board[row][column];
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
              return board[row][column];
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
              return board[row][column];
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
            return board[row][column];
          }
        }
      }
    }

    if (filled) return -1;
  };

  const calculateEmptySlot = (slots, column) => {
    let row = size.rows - 1;
    while (row > 0 && slots[row][column] !== 0) {
      row--;
    }

    if (row >= 0 && slots[row][column] === 0) {
      return row;
    } else if (row === 0) {
      return null;
    }
  };

  const minimax = (state, depth, alpha, beta, maximizingPlayer) => {
    const winner = checkBoard(state);
    if (winner || depth === 0) {
      if (winner === 1) return { evaluation: 1 };
      else if (winner === 2) return { evaluation: -1 };
      else return { evaluation: 0 };
    }

    if (maximizingPlayer) {
      let maximumEvaluation = { evaluation: -Infinity };
      
      for (let column = 0; column < size.columns; column++) {
        let emptySlot = calculateEmptySlot(state, column);
        if (emptySlot !== null) {
          let newState = state.map((a) => [...a]);
          newState[emptySlot][column] = 1;
          const evaluation = minimax(
            newState,
            depth - 1,
            alpha,
            beta,
            false
          ).evaluation;

          if (evaluation > maximumEvaluation.evaluation) {
            maximumEvaluation.evaluation = evaluation;
            maximumEvaluation.position = column;
          }

          alpha = Math.max(alpha, evaluation);
          if (beta <= alpha) break;
        }
      }

      return maximumEvaluation;
    } else {
      let minimumEvaluation = { evaluation: +Infinity };

      for (let column = 0; column < size.columns; column++) {
        let emptySlot = calculateEmptySlot(state, column);
        if (emptySlot !== null) {
          let newState = state.map((a) => [...a]);
          newState[emptySlot][column] = 2;
          const evaluation = minimax(
            newState,
            depth - 1,
            alpha,
            beta,
            true
          ).evaluation;

          if (evaluation < minimumEvaluation.evaluation) {
            minimumEvaluation.evaluation = evaluation;
            minimumEvaluation.position = column;
          }

          beta = Math.min(beta, evaluation);
          if (beta <= alpha) break;
        }
      }

      return minimumEvaluation;
    }
  }

  const placePiece = (column) => {
    if (!gameOver) {
      const emptySlot = calculateEmptySlot(board, column);
      if (emptySlot !== null) {
        board[emptySlot][column] = currentPlayer.piece;

        const result = checkBoard(board);
        if (result) {
          gameOver = true;
          if (result > 0) {
            win.winner = currentPlayer.name;
            if (win.winner === players[0].name) {
              players[0].score++;
            } else if (win.winner === players[1].name) {
              players[1].score++;
            }
          }
        }
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        return true;
      }
      return false;
    }
  };

  const placePlayerPiece = (column) => {
    if (currentPlayer.name !== "Computer") {
      return placePiece(column);
    }
    return false;
  }

  const placeComputerPiece = () => {
    let emptyBoard = true;
    for (let column = 0; column < size.columns; column++) {
      if (board[size.rows - 1][column] !== 0) {
        emptyBoard = false;
      }
    }
    if (difficulty === "easy" || emptyBoard) {
      let position = Math.floor(Math.random() * size.columns);
      while (!placePiece(position)) {
        position = Math.floor(Math.random() * size.columns);
      }
    } else {
      let blunderChance = 0;
      if (difficulty === "normal") blunderChance = 50;
      else if (difficulty === "hard") blunderChance = 25;

      if (Math.floor(Math.random() * 100) < blunderChance) {
        let position = Math.floor(Math.random() * size.columns);
        while (!placePiece(position)) {
          position = Math.floor(Math.random() * size.columns);
        }
      } else {
        const isMaximizing = currentPlayer === players[0];
        const startTime = performance.now();
        let position = minimax(
          board,
          5,
          -Infinity,
          +Infinity,
          isMaximizing
        ).position;
        console.log(`Time taken: ${(performance.now() - startTime)} ms`);
        placePiece(position);
      }
    }
  };

  return {
    displayBoard,
    setPlayers,
    setDifficulty,
    setMode,
    placePlayerPiece,
    placeComputerPiece,
    calculateEmptySlot,
    resetScores,
    resetBoard,
    getBoard,
    getPlayers,
    getMode,
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
        const pieceContainer = squareContainer.firstElementChild;

        const piece = game.getBoard()[row][column];
        if (piece === 1) {
          pieceContainer.classList.remove("ghost");
          pieceContainer.classList.remove("two");
          pieceContainer.classList.add("one");
        } else if (piece === 2) {
          pieceContainer.classList.remove("ghost");
          pieceContainer.classList.remove("one");
          pieceContainer.classList.add("two");
        }

        if (!game.getGameOver()) {
          turnIndicator.textContent = `${game.getCurrentPlayer().name}'s turn`;
        }
      }
    }
  };

  const updateResult = (winner) => {
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
    const difficulty = form.get("difficulty");
    
    if (playerTurn === "one") {
      game.setPlayers(playerName, "Computer");
    } else if (playerTurn === "two") {
      game.setPlayers("Computer", playerName);
    }
    game.setDifficulty(difficulty);

    changeDisplayWrapper(computerNamesWrapper, gamePageWrapper);
    game.resetBoard();
    game.setMode("computer");
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
    game.setMode("friend");
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
      squareContainer.dataset.column = column;

      const pieceContainer = document.createElement("div");
      pieceContainer.classList.add("piece");
      squareContainer.appendChild(pieceContainer);

      squareContainer.addEventListener("click", () => {
        if (!game.getGameOver()) {
          if (game.placePlayerPiece(column)) {
            updateBoard();
            updateResult(game.getWin().winner);
            if (!game.getGameOver() && game.getMode() === "computer")  {
              setTimeout(() => {
                game.placeComputerPiece();
                updateBoard();
                updateResult(game.getWin().winner);
              }, 0.5 * 1000);
            }
          }
        }
      });

      squareContainer.addEventListener("mouseenter", (event) => {
        if (game.getCurrentPlayer().name !== "Computer") {
          const ghostPieceContainer =
            gameBoardContainer.children[
              game.calculateEmptySlot(
                game.getBoard(),
                event.target.dataset.column
              )
            ].children[event.target.dataset.column].firstElementChild;
          ghostPieceContainer.classList.add("ghost");
          ghostPieceContainer.classList.add(
            game.getCurrentPlayer() === game.getPlayers()[0] ? "one" : "two"
          );
        }
      });

      squareContainer.addEventListener("mouseleave", (event) => {
        const ghostPieceContainer =
          gameBoardContainer.children[
            game.calculateEmptySlot(
              game.getBoard(),
              event.target.dataset.column
            )
          ].children[event.target.dataset.column].firstElementChild;
        ghostPieceContainer.classList.remove("ghost");
        ghostPieceContainer.classList.remove("one");
        ghostPieceContainer.classList.remove("two");
      });

      rowContainer.appendChild(squareContainer);
    }
    gameBoardContainer.appendChild(rowContainer);
  }
})();
