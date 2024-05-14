import * as React from 'react';

export default function Sudoku() {
  return(
    <>
      <h1>
        Sudoku
      </h1>
      {/* <ol>

        <li>A sudoku board is a 9x9 grid, with 3x3 subgrids.</li>
        <li>Each sub-grid can only have digits from 1-9, and digits cannot be repeated</li>
        <li>Interactions
          The user should be able to put a number 1-9 as long as it does not violate rule #2
          The use should be able to clear the board
        </li>
      </ol> */}
      <SudokuBoard />
    </>
  )
}

// Start 8.43
// End 9.38
/*
type Cell = {
  value: '1' | '2' | ... | '9' | null
}



*/

function initBoard() {
  return new Array(9).fill(new Array(9).fill({ value: null }))
}

const cellValues = new Array(9).fill(null).map((_, i) => `${i+1}`);
const completeGridSet = new Set(cellValues)

function getSubgridLimits(i, j) {
  let endI, endJ;

  if (i <= 2) {
    endI = 2;
  } else if (i <= 5){
    endI = 5
  } else {
    endI = 8
  }

  if (j <= 2) {
    endJ = 2;
  } else if (j <= 5){
    endJ = 5
  } else {
    endJ = 8
  }

  return { endI, endJ }
}

function SudokuBoard() {
  const [board, setBoard] = React.useState(initBoard);
  const [selectedCell, setSelectedCell] = React.useState(null);

  const validMove = (i, j, newB) => {
    let movesSet = [];
    // Check row
    for(let x = 0; x < newB.length; x++) {
      if (newB[i][x]?.value !== null) {
        movesSet.push(newB[i][x]?.value)
      }
    }

    if (new Set(movesSet).size !== movesSet.length) {
      // We have repeated moves
      return false;
    }

    // Check column

    movesSet = [];
    // Check column
    for(let x = 0; x < newB.length; x++) {
      if (newB[x][j]?.value !== null) {
        movesSet.push(newB[x][j]?.value)
      }
    }

    if (new Set(movesSet).size !== movesSet.length) {
      // We have repeated moves
      return false;
    }

    // Check subgrid
    movesSet = [];
    const { endI, endJ } = getSubgridLimits(i, j)
    for(let x = endI - 2; x <= endI; x++) {
      for(let y = endJ - 2; y <= endJ; y++) {
        if (newB[x][y]?.value !== null) {
          movesSet.push(newB[x][y]?.value)
        }
      }
    }

    if (new Set(movesSet).size !== movesSet.length) {
      // We have repeated moves
      return false;
    }

    return true;
  }

  const setValue = (value) => {
    const { i, j} = selectedCell;
    const newB = [...board];
    const newR = [...newB[i]]
    newR[j] = { value }
    newB[i] = newR

    if (validMove(i, j, newB)) {
      setBoard(newB);
    } else {
      alert('Invalid move!')
    }
  }
  
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRow: 'repeat(9, 1fr)', border: '1px solid black', borderRight: 0, width: 'fit-content' }}>
        {board.map((row, i) => {
          return row.map((cell, j) => {
            return (
              <Cell
                key={`${i}_${j}`}
                style={{
                  ...(i === 2 || i === 5 ? { borderBottom: '3px solid black' } : {}),
                  ...(j === 2 || j === 5 ? { borderRight: '3px solid black' } : {}),
                  ...(selectedCell?.i === i && selectedCell?.j === j ? { backgroundColor: 'lightblue' } : {}),
                }}
                onSelect={() => setSelectedCell({ i, j })}
              >
                {cell.value}
              </Cell>
            )
          })
        })}
      </div>
      <div style={{display: 'flex', gap: 8, marginTop: 16}}>
        {cellValues.map(value => (
          <button key={value} onClick={() => setValue(value)}>
            {value}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedCell(null)
            setBoard(initBoard())
          }}
        >
          Clear
        </button>
      </div>
    </>
  );
}

function Cell({ children, style, onSelect }) {
  return (
    <div
      style={{ height: 64, width: 64, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black', borderBottom: '1px solid black', ...style }}
      onClick={onSelect}
    >
      {children}
    </div>
  )
}
