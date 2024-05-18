import * as React from 'react';

export default function Tetris() {
  return(
    <>
      <h1>
        Tetris
      </h1>
      {/* <p>
        Build a Tetris Game (as far as you can take it)
      </p> */}
      {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/M8fqHaJU_cc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
      <TetrisGame />
    </>
  )
}

// Start time: 19.15
// End time: 19.17
/*

type Cell = {
  x: number;
  y: number;
  isFilled: boolean;
}

type Piece = {
  type: 'square';
  x: number;
  y: number
}

type State = {
  grid: Array<Array<Cell>>
  currentPiece: Piece;
}

*/

function initGrid() {
  const initialGrid = new Array(20).fill(null)
    .map((_, x) => new Array(10).fill(null)
      .map((_, y) => ({ x, y, fillColor: null }))
    );

  return initialGrid;
}

function initState() {
  return {
    count: 0,
    grid: initGrid(),
    currentPiece: null,
  }
}

function getRandomPiece() {
  // TODO: generate other pieces
  return {
    type: 'square',
    x: 4,
    y: -1, // starts initially outside the grid, will be incremented as part of the tick
  };
}

function hasSpaceToMove(state, direction) {
  const { currentPiece, grid } = state;

  switch(currentPiece.type) {
    case 'square': {
      switch(direction) {
        case 'down': {
          return (grid?.[currentPiece.y + 1 + 2]?.[currentPiece.x]?.fillColor) === null &&
            (grid?.[currentPiece.y + 1 + 2][currentPiece.x + 1]?.fillColor) === null;
        }
      }
    }
  }
}

// Assumes the movement is valid, will mutate the grid and the piece
function movePieceTo(state, direction) {
  const { currentPiece, grid } = state;
  
  switch(currentPiece.type) {
    case 'square': {
      switch(direction) {
        case 'down': {
          // return Boolean(grid?.[currentPiece.y + 1 + 2]?.[currentPiece.x]?.fillColor) &&
          //   Boolean(grid?.[currentPiece.y + 1 + 2][currentPiece.x + 1]?.fillColor);
          if (grid?.[currentPiece.y]?.[currentPiece.x]) {
            grid[currentPiece.y][currentPiece.x].fillColor = null;
          }

          if (grid?.[currentPiece.y]?.[currentPiece.x + 1]) {
            grid[currentPiece.y][currentPiece.x + 1].fillColor = null;
          }

          grid[currentPiece.y + 1][currentPiece.x].fillColor = 'lightblue';
          grid[currentPiece.y + 1][currentPiece.x + 1].fillColor = 'lightblue';

          grid[currentPiece.y + 2][currentPiece.x].fillColor = 'lightblue';
          grid[currentPiece.y + 2][currentPiece.x + 1].fillColor = 'lightblue';

          currentPiece.y = currentPiece.y + 1

          return;
        }
      }
    }
  }
}

function useTetris() {
  const [state, setState] = React.useState(initState)

  const tick = React.useCallback(() => {
    const newState = structuredClone(state);
    newState.count = newState.count + 1;

    if (!newState.currentPiece) {
      newState.currentPiece = getRandomPiece()
    }

    if (hasSpaceToMove(newState, 'down')) {
      movePieceTo(newState, 'down')
    } else {
      //
    }

    console.log({ piece: newState.currentPiece })


    setState(newState);
  }, [state]);

  const tickRef = React.useRef();

  React.useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  React.useEffect(function setTick() {
    const intervalId = window.setInterval(() => {
      tickRef.current?.();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return {
    ...state,
  };
}

function TetrisGame() {
  const { grid, count } = useTetris();

  // console.log({ grid, count })

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'repeat(20, 1fr)', gridTemplateColumns: 'repeat(10, 1fr)', width: 'fit-content', gap: 4, border: '1px solid black', padding: 2 }}>
      {grid.map(row => row.map(cell => (
        <div
          key={`${cell.x}_${cell.y}`}
          data-cell={`${cell.x}_${cell.y}`}
          style={{ height: 30, width: 30, backgroundColor: cell.fillColor ?? 'lightgrey' }}
        />
      )))}
    </div>
  )
}
