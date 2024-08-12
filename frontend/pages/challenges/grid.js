import { useState } from 'react';

export default function Grid() {
  // return (
  //   <div>
  //     <p>Ramp question from glassdoor</p>
  //     <p>Use React to make a 4x4 grid where each cell can have a normal, active, or dead state (should be reflected with colors).</p>
  //     <p>Clicking a cell will toggle it between normal and active, and activating a normal cell while another cell is active will make those two cells "fight" (use random number) and return one to normal and the other to dead.</p>
  //     <p>At the end, output the winning cell and all the cells that that cell defeated. Follow up: "What would you change about the code if you were going to add more functionality to the cells later"</p>
  //   </div>
  // );
  return <GridGame />;
}

const cellStyles = {
  0: { backgroundColor: 'black' },
  1: {  },
  2: { backgroundColor: 'cyan' },
};

const GridGame = () => {
  // 0 dead
  // 1 normal
  // 2 active
  const [cells, setCells] = useState(() => new Array(16).fill(null).map(() => ({
    status: 1,
    victories: [],
  })));
  const gameFinished = cells.filter(cell => cell.status !== 0).length === 1;
  const winnerCell = gameFinished ? cells.findIndex(cell => cell.status !== 0) : -1;

  const handleCellClick = (clickedIndex) => () => {
    if (cells[clickedIndex].status === 0) return; // can't toggle if dead
    
    const activeCellIndex = cells.findIndex(cell => cell.status === 2);
    const cellsCopy = [...cells];
    const newCellValue = cells[clickedIndex].status === 1 ? 2 : 1;
    
    if (activeCellIndex >= 0 && newCellValue === 2) {
      const clickedCellPower = Math.random();
      const activeCellPower = Math.random();

      cellsCopy[activeCellIndex] = {
        status: activeCellPower >= clickedCellPower ? 1 : 0,
        victories: activeCellPower >= clickedCellPower ? [...cellsCopy[activeCellIndex].victories, clickedIndex] : cellsCopy[activeCellIndex].victories,
      };
      cellsCopy[clickedIndex] = {
        status: clickedCellPower >= activeCellPower ? 1 : 0,
        victories: clickedCellPower >= activeCellPower ? [...cellsCopy[clickedIndex].victories, activeCellIndex] : cellsCopy[clickedIndex].victories,
      };
    } else {
      cellsCopy[clickedIndex] = {
        ...cellsCopy[clickedIndex],
        status: newCellValue
      };
    }

    setCells(cellsCopy)
  };  

  return (
    <>
      <div style={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gridTemplateColumns: 'repeat(4, 1fr)', width: 'fit-content', gap: 4, border: '1px solid black', padding: 2 }}>
        {cells.map((cell, i) => (
          <button key={i} style={cellStyles[cell.status]} onClick={handleCellClick(i)}>
            {cell.status}
          </button>
        ))}
      </div>
      {gameFinished && (
        <div>Game finished! Victories: {JSON.stringify(cells[winnerCell].victories)}</div>
      )}
    </>
  );
}
