import * as React from 'react';

const BOARD_X = 10;
const BOARD_Y = 20;

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
];

class Tetris {
  constructor() {
    this.board = new Array(BOARD_Y).fill(null).map(() => new Array(BOARD_X).fill(0));
    this.generatePiece();
  }

  generatePiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.piece = {
      x: BOARD_X / 2 - Math.floor(shape[0].length / 2),
      y: 0,
      shape,
    };

    if (!this.check({ dx: 0, dy: 0 })) {
      this.gameOver = true;
    } else {
      this.place();
    }
  }

  place({ remove = false, stick = false } = {}) {
    const { shape } = this.piece;
    for(let y = 0; y < shape.length; y++) {
      for(let x = 0; x < shape[0].length; x++) {
        if (shape[y][x]) {
          const newY = this.piece.y + y;
          const newX = this.piece.x + x;
          this.board[newY][newX] = remove ? 0 : stick ? 2 : shape[y][x];
        }
      }
    }
  }

  check({ dx, dy, shape = this.piece.shape }) {
    for(let y = 0; y < shape.length; y++) {
      for(let x = 0; x < shape[0].length; x++) {
        const newY = this.piece.y + y + dy;
        const newX = this.piece.x + x + dx;
        
        if (newX < 0 || newX >= BOARD_X) {
          return false;
        }

        if (newY >= BOARD_Y) {
          return false;
        }

        if (this.board[newY][newX] === 2 && shape[y][x] === 1) {
          return false;
        }
      }
    }

    return true;
  }

  rotateShape() {
    const { shape } = this.piece;
    const rotatedShape = new Array(shape[0].length).fill(null).map(() => new Array(shape.length).fill(0));

    for (let x = 0; x < shape[0].length; x++) {
      for (let y = 0; y < shape.length; y++) {
        if (shape[y][x]) {
          rotatedShape[x][rotatedShape[0] .length - y - 1] = shape[y][x];
        }
      }
    }

    return rotatedShape;
  }

  move({ dx = 0, dy = 0, rotate = false }) {
    const shape = rotate ? this.rotateShape() : this.piece.shape
    const valid = this.check({ dx, dy, shape });

    if (!valid && dy) {
      this.place({ stick: true });
      this.clearLines();
      this.generatePiece();
      return;
    }

    if (!valid) {
      return;
    }

    this.place({ remove: true });
    this.piece.x += dx;
    this.piece.y += dy;
    this.piece.shape = shape;
    this.place();
  }

  clearLines() {
    this.board.forEach((row, i) => {
      if (row.every(cell => cell === 2)) {
        this.board.splice(i, 1)
        this.board.unshift(new Array(BOARD_X).fill(0))
      }
    })
  }
}

const tetris = new Tetris();
const cellStyles = (cell) => ({
  width: '40px',
  height: '40px',
  border: '1px solid black',
  backgroundColor: cell === 1 ? 'cyan' : cell === 2 ? 'red' : undefined,
});

export default function TetrisGame() {
  const [, render] = React.useReducer(() => ({}));

  React.useEffect(() => {
    const keyDownHandler = (e) => {
      console.log('key down', e.key);
      if (e.key === 'ArrowDown') {
        tetris.move({ dy: 1 });
        render({});
      }
      if (e.key === 'ArrowLeft') {
        tetris.move({ dx: -1 });
        render();
      }
      if (e.key === 'ArrowRight') {
        tetris.move({ dx: 1 });
        render();
      }
      if (e.key === 'ArrowUp') {
        tetris.move({ rotate: true });
        render();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    }
  }, []);

  React.useEffect(() => {
    function tick() {
      tetris.move({ dy: 1 });
      render();
    }

    const interval = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(interval);
    }
  }, []);

  if (tetris.gameOver) {
    return <div>Game over!</div>
  }

  return(
    <>
      <h1>
        Tetris
      </h1>
      <div>
        {tetris.board.map((row, i) => (
          <div key={i} style={{ display: 'flex', }}>
            <span style={{ width: 40 }}>{i}</span>
            <div style={{ display: 'flex' }}>
              {row.map((cell, j) => <div key={j} style={cellStyles(cell)} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
