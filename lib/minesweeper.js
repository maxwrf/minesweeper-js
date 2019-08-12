const grid = document.getElementById("minesweeper");
const easy = document.getElementById("easy");
const medium = document.getElementById("medium");
const hard = document.getElementById("hard");
const resetBtn = document.getElementById("reset");
const score = document.getElementById("score");
let gameOver = false;
let times = 8;
let seeds = 10;


const generateGrid = () => {
  for (let i = 0; i < times; i += 1) {
    const row = grid.insertRow(i);
    for (let j = 0; j < times; j += 1) {
      const cell = row.insertCell(j);
      cell.classList.add("unopened");
      cell.id = (i * 10 + j);
    }
  }
};

const seedMines = () => {
  for (let i = 0; i < seeds + 1; i += 1) {
    const row = Math.floor(Math.random() * times);
    const col = Math.floor(Math.random() * times);
    const cell = grid.rows[row].cells[col];
    cell.classList.add("mine");
  }
};

const countAdj = () => {
  for (let i = 0; i < times; i += 1) {
    for (let j = 0; j < times; j += 1) {
      const arr = [];
      const field = grid.rows[i].cells[j];
      const cellid = grid.rows[i].cells[j].id;
      for (let a = 0; a < times; a += 1) {
        for (let b = 0; b < times; b += 1) {
          if ([i - 1, i + 1, i].includes(a) && [j - 1, j + 1, j].includes(b)) {
            arr.push(grid.rows[a].cells[b]);
          }
        }
      }
      arr.forEach((cell, index) => { if (cell.id === cellid) { arr.splice(index, 1); } });
      const mines = arr.filter(cell => cell.classList.contains("mine"));
      if (field.classList.length === 1) {
        if (mines.length === 1) { field.classList.add("mine-neighbour-1"); }
        if (mines.length === 2) { field.classList.add("mine-neighbour-2"); }
        if (mines.length === 3) { field.classList.add("mine-neighbour-3"); }
        if (mines.length === 4) { field.classList.add("mine-neighbour-4"); }
        if (mines.length === 5) { field.classList.add("mine-neighbour-5"); }
        if (mines.length === 6) { field.classList.add("mine-neighbour-6"); }
        if (mines.length === 7) { field.classList.add("mine-neighbour-7"); }
        if (mines.length === 8) { field.classList.add("mine-neighbour-8"); }
      }
    }
  }
};

const revealAll = () => {
  gameOver = true;
  for (let i = 0; i < times; i += 1) {
    for (let j = 0; j < times; j += 1) {
      const field = grid.rows[i].cells[j];
      field.classList.remove("unopened");
      field.classList.remove("flagged");
      if (field.classList.length === 0) { field.classList.add("opened"); }
    }
  }
};


const reveal = (a, b) => {
  const arr = [];
  if ((b - 1) >= 0) { arr.push(grid.rows[a].cells[b - 1]); }
  if ((b + 1) <= times - 1) { arr.push(grid.rows[a].cells[b + 1]); }
  if ((a - 1) >= 0) { arr.push(grid.rows[a - 1].cells[b]); }
  if ((a + 1) <= times - 1) { arr.push(grid.rows[a + 1].cells[b]); }
  if (arr.every(element => element.classList.contains("mine") === false)) {
    const savers = arr.filter(cell => cell.classList.contains("unopened"));
    savers.forEach((field) => {
      field.classList.remove("unopened");
      if (field.classList.length === 0) { field.classList.add("opened"); }
      reveal(field.parentElement.rowIndex, field.cellIndex);
    });
  }
};

const move = () => {
  for (let i = 0; i < times; i += 1) {
    for (let j = 0; j < times; j += 1) {
      const field = grid.rows[i].cells[j];
      field.addEventListener("click", (event) => {
        field.classList.remove("unopened");
        if (field.classList.length === 0) {
          field.classList.add("opened");
          reveal(i, j);
        }
        if (field.classList.contains("mine")) {
          revealAll();
          alert("Game Over!");
        }
      });
    }
  }
};

const checkForWin = () => {
  let bombsFound = 0;
  let othersFlagged = 0;
  for (let i = 0; i < times; i += 1) {
    for (let j = 0; j < times; j += 1) {
      const field = grid.rows[i].cells[j];
      if (field.classList.contains("flagged") && field.classList.contains("mine")) {
        bombsFound += 1;
      }
      if (field.classList.contains("flagged") && field.classList.contains("mine") === false) {
        othersFlagged += 1;
      }
    }
  }
  if (bombsFound === seeds && othersFlagged === 0) {
    revealAll();
    alert("You won!");
  } else {
    score.innerText = `${seeds - bombsFound} bombs left`;
  }
};

const mark = () => {
  for (let i = 0; i < times; i += 1) {
    for (let j = 0; j < times; j += 1) {
      const field = grid.rows[i].cells[j];
      field.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (field.classList.contains("unopened")) {
          field.classList.remove("unopened");
          field.classList.add("flagged");
        } else if (field.classList.contains("flagged")) {
          field.classList.remove("flagged");
          field.classList.add("unopened");
        }
        checkForWin();
      });
    }
  }
};

let time = 0;
const startTimer = () => {
  const timer = document.getElementById("timer");
  setTimeout((updateTimer) => {
    startTimer();
    if (gameOver === false) {
      time += 1;
      timer.innerText = `${time}s`;
    }
  }, 1000);
};

const reset = () => {
  grid.innerHTML = "";
  generateGrid();
  seedMines();
  countAdj();
  move();
  mark();
  gameOver = false;
  time = 0;
  score.innerText = `${seeds} bombs left`;
};

resetBtn.addEventListener('click', (event) => {
  reset();
});

easy.addEventListener('click', (event) => {
  times = 8;
  seeds = 10;
  reset();
  easy.setAttribute("disabled", "");
  medium.removeAttribute("disabled");
  hard.removeAttribute("disabled");
});

medium.addEventListener('click', (event) => {
  times = 16;
  seeds = 40;
  reset();
  easy.removeAttribute("disabled");
  medium.setAttribute("disabled", "");
  hard.removeAttribute("disabled");
});

hard.addEventListener('click', (event) => {
  times = 24;
  seeds = 99;
  reset();
  easy.removeAttribute("disabled");
  medium.removeAttribute("disabled");
  hard.setAttribute("disabled", "");
});


generateGrid();
seedMines();
countAdj();
move();
mark();
startTimer();
