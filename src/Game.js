import React, { useState } from 'react';
import './index.css';

// Square component
function Square({ value, onClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'highlight' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ squares, onClick, winningSquares }) {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={winningSquares.includes(i)}
      />
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(renderSquare(row * 3 + col));
      }
      board.push(
        <div key={row} className="board-row">
          {boardRow}
        </div>
      );
    }
    return board;
  };

  return <div>{renderBoard()}</div>;
}

// Game component
export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  const current = history[stepNumber];
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;

  const handleClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    
    if (winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    const row = Math.floor(i / 3);
    const col = i % 3;
    setHistory(newHistory.concat([{ squares, moveLocation: { row, col } }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  const moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} (${step.moveLocation.row}, ${step.moveLocation.col})`
      : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{move === stepNumber ? <strong>You are at move #{move}</strong> : desc}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (stepNumber === 9) {
    status = 'The game is a draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className="game-info">
            <div className="status">{status}</div>
            <button className="sort-toggle" onClick={toggleSort}>
                {isAscending ? 'Sort Moves Descending' : 'Sort Moves Ascending'}
            </button>
        </div>
        <Board
          squares={current.squares}
          onClick={handleClick}
          winningSquares={winnerInfo ? winnerInfo.line : []}
        />
      </div>
      
      <div className="game-info">
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

// Helper function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
