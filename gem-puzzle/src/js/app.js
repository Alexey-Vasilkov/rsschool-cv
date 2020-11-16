localStorage.setItem("dimentions", "3");

let sound = new Audio(); 
sound.src = "../src/assets/sound/click.mp3"

function playSound(){
  sound.currentTime = 0;       
  sound.play();  
}

const gameScreen = document.createElement("div");
gameScreen.classList.add("game-screen");
document.body.appendChild(gameScreen);

const gameControls = document.createElement('div');
gameControls.classList.add("game-controls");
document.querySelector(".game-screen").appendChild(gameControls);

const resetButton = document.createElement("button");
resetButton.classList.add("reset__button");
resetButton.innerHTML = "reset";
document.querySelector(".game-controls").appendChild(resetButton);

document.querySelector(".reset__button").addEventListener("click", () => {
  location.reload();
});

const endGameButton = document.createElement("button");
endGameButton.classList.add("end-game__button");
endGameButton.innerHTML = "end game";
document.querySelector(".game-controls").appendChild(endGameButton);

document.querySelector(".end-game__button").addEventListener("click", () => {
  lastScreenText.innerText = "please. try again!";
  onFinished();
});

const field = document.createElement('div');
field.setAttribute('id', 'puzzle-wrapper');
document.querySelector('.game-screen').appendChild(field);

const gameInfo = document.createElement("div");
gameInfo.classList.add("game-info");
document.querySelector(".game-screen").appendChild(gameInfo);

const totalTime = document.createElement("div");
totalTime.classList.add("game-time");
document.querySelector(".game-info").appendChild(totalTime);

const gameScreenButton = document.createElement("button");
gameScreenButton.classList.add("game-screen__button");
gameScreenButton.innerHTML = "new game";
document.querySelector(".game-info").appendChild(gameScreenButton);

document.querySelector(".game-screen__button").addEventListener('click', () => {
  location.reload();  
});

const totalMoves = document.createElement("div");
totalMoves.classList.add("game-moves");
document.querySelector(".game-info").appendChild(totalMoves);

let endGameMessage = '';

function getRandom(n) {
  return Math.floor(Math.random() * n) + 1;
}

function getBackground() {
  let url = `../src/assets/box/${getRandom(90)}.jpg`
  return url;
}

totalMoves.innerHTML = `Moves: 0`;
totalTime.innerHTML = `Time: 00:00`;

class PicturePuzzle{
  constructor(el, imageSrc, width, dimention = 3) {
    this.parentEl = el;
    this.dimention = dimention;
    this.imageSrc = imageSrc;
    this.width = width;    
    this.cells = [];
    this.shuffling = false;
    this.numberOfMovements = 0;    

    this.init();

    const img = new Image();
    img.onload = () => {      
      this.height = img.height * this.width/img.width;
      this.el.style.width = `${this.width}px`;
      this.el.style.height = `${this.height}px`;

      this.setup();
      startTimer();      
    };

    img.src = this.imageSrc;    
  }  

  init() {
    this.el = this.createWrapper();
    this.parentEl.appendChild(this.el);
  }

  createWrapper() {
    const div = document.createElement('div');  
    div.style.position = 'relative';
    div.style.margin = '0 auto';

    return div;
  }

  sizeOptions() {    
    const label = document.createElement('label');
    label.innerText = 'Choose size:';
    document.querySelector('.last-screen__content').appendChild(label);
    const select = document.createElement('SELECT');    
    select.classList.add('select_option');    
    document.querySelector('.last-screen__content').appendChild(select);

    const firstOption = document.createElement('OPTION');
    firstOption.innerHTML = "..."; 
    document.querySelector('.select_option').appendChild(firstOption);      

    for (let i = 3; i < 9; i++) {
      const option = document.createElement('OPTION');
      option.setAttribute('id', `id ${i}`);
      option.setAttribute('value', `${i}`);
      document.querySelector('.select_option').appendChild(option);      
      option.innerHTML = `${i} &times; ${i}`;          
      document.querySelector('.select_option').addEventListener('change', sizeChange);

      function sizeChange() {
        let x = document.querySelector(".select_option").value;
        localStorage.setItem("dimention", `${x}`);        
      }
      
    }
    
  } 

  setup() {    

    for(let i=0; i < this.dimention * this.dimention; i++) {
      this.cells.push(new Cell(this, i));
    }
    this.shuffle();    
  }

  shuffle() {
    this.shuffling = true;
    for (let i = this.cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swapCells(i, j);
    }    
    this.shuffling = false;
  }

  swapCells(i, j, animate) {        
    this.cells[i].setPosition(j, animate, i);
    this.cells[j].setPosition(i);
    [this.cells[i], this.cells[j]] = [this.cells[j], this.cells[i]];    
    if (!this.shuffling && this.isAssembled()) {
      onFinished();      
    }
  }  

  isAssembled() {
    localStorage.setItem("timeElapsed", `${timeToString(elapsedTime)}`);
    localStorage.setItem("numberOfMoves", `${this.numberOfMovements}`);
    for (let i = 0; i < this.cells.length; i++) {
      if (i !== this.cells[i].index) {
        if (i === 6 && this.cells[i].index === 8 && this.cells[i + 1].index === i + 1) {          
          lastScreenText.innerText = `This game cannot be finished. It took you ${localStorage.getItem("timeElapsed")} and ${localStorage.getItem("numberOfMoves")} moves`;                      
          return true;
        }
        return false;
      }
    }
    lastScreenText.innerText = `Cool!! you have finished this puzzle in ${localStorage.getItem("timeElapsed")} and ${localStorage.getItem("numberOfMoves")} moves`;      
    return true;
  }

  findPosition(ind) {
    return this.cells.findIndex(cell => cell.index === ind);
  }

  findEmpty() {
    return this.cells.findIndex(cell => cell.isEmpty);
  }   
}

window.PicturePuzzle = window.PicturePuzzle || PicturePuzzle;

class Cell{
  constructor(puzzle, ind) {    
    this.isEmpty = false;
    this.index = ind;
    this.puzzle = puzzle; 
    // this.puzzle.dimention = 6;   
    this.width = this.puzzle.width / this.puzzle.dimention;
    this.height = this.puzzle.height / this.puzzle.dimention;

    this.el = this.createDiv();
    puzzle.el.appendChild(this.el);    
    
    
    if (this.index === this.puzzle.dimention * this.puzzle.dimention - 1) {
      this.isEmpty = true;
      return;
    }
    this.setImage();
    this.setPosition(this.index);    
  }   

  createDiv() {
    const div = document.createElement('div'); 
    div.style.backgroundSize = `${this.puzzle.width}px ${this.puzzle.height}px`;   
        
    div.style.border = 'none';
    div.style.borderRadius = '5px';
    div.style.position = 'absolute';    
    div.style.width = `${this.width}px`;    
    div.style.height = `${this.height}px`;       

    div.onclick = () => {
      playSound();
      const currentCellIndex = this.puzzle.findPosition(this.index);
      const emptyCellIndex = this.puzzle.findEmpty();
      const {x, y} = this.getXY(currentCellIndex);
      const {x: emptyX, y: emptyY} = this.getXY(emptyCellIndex);

      if ((x === emptyX || y === emptyY) && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
        this.puzzle.numberOfMovements++;
        if (this.puzzle.onSwap && typeof this.puzzle.onSwap === 'function') {
          this.puzzle.onSwap(this.puzzle.numberOfMovements);
        }
        this.puzzle.swapCells(currentCellIndex, emptyCellIndex, true);        
      }
    };
    return div;
  }

  setImage() {
    const {x, y} = this.getXY(this.index);
    const left = this.width * x;
    const top = this.height * y;

    this.el.style.backgroundImage = `url(${this.puzzle.imageSrc})`;
    this.el.style.backgroundPosition = `-${left}px -${top}px`;    
  }

  setPosition(destinationIndex, animate, currentIndex) {  
    const {left, top} = this.getPositionFromIndex(destinationIndex);
    const {left: currentLeft, top: currentTop} = this.getPositionFromIndex(currentIndex);

    if (animate) {
      if (left !== currentLeft) {
        this.animate('left', currentLeft, left);        
      } else if (top !== currentTop) {
        this.animate('top', currentTop, top);
      }
    } else {
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    }    
  }

  animate(position, currentPosition, destination) {
    const animationDuration = 250;
    const frameRate = 10;
    let step = frameRate * Math.abs((destination - currentPosition)) / animationDuration;

    let id = setInterval(() => {
      if (currentPosition < destination) {
        currentPosition = Math.min(destination, currentPosition + step);
        if (currentPosition >= destination) {
          clearInterval(id)
        }
      } else {
        currentPosition = Math.max(destination, currentPosition - step);
        if (currentPosition <= destination) {
          clearInterval(id)
        }
      }

      this.el.style[position] = `${currentPosition}px`;
    }, frameRate)
  } 

  getPositionFromIndex(index) {
    const {x, y} = this.getXY(index);

    return {
      left: this.width * x,
      top: this.height * y
    }
  }

  getXY(index) {
    return {
      x: index % this.puzzle.dimention,
      y: Math.floor(index / this.puzzle.dimention)
    }
  }
}

function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);    

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");  

  return `${formattedMM}:${formattedSS}`;
}

let startTime;
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval( () => {
    elapsedTime = Date.now() - startTime;
    totalTime.innerHTML = `Time: ${timeToString(elapsedTime)}`;
  }, 10);  
}

function pauseTimer() {  
  clearInterval(timerInterval);  
}

function resetTimer() {
  clearInterval(timerInterval);  
  elapsedTime = 0;  
  totalTime.innerHTML = `Time: ${timeToString(elapsedTime)}`;
}

const picturePuzzle = new PicturePuzzle (
  document.querySelector('#puzzle-wrapper'),
  `../src/${getBackground(150)}`,
  500,
  parseInt(localStorage.getItem("dimention"))
);

picturePuzzle.onSwap = function(movements) {  
  totalMoves.innerHTML = `Moves: ${movements}`;
}

function onFinished() { 
  picturePuzzle.sizeOptions();  
  pauseTimer();
  document.querySelector(".game-screen").style.display = "none";
  document.querySelector(".last-screen").style.display = "block";    
};

const lastScreen = document.createElement("div");
lastScreen.classList.add("last-screen");
document.body.appendChild(lastScreen);

const lastScreenContent = document.createElement("div");
lastScreenContent.classList.add("last-screen__content");
document.querySelector(".last-screen").appendChild(lastScreenContent);

const lastScreenText = document.createElement("div");
lastScreenText.classList.add("last-screen__text");
document.querySelector(".last-screen__content").appendChild(lastScreenText);

const lastScreenButton = document.createElement("button");
lastScreenButton.classList.add("last-screen__button");
lastScreenButton.innerHTML = "new game";
document.querySelector(".last-screen__content").appendChild(lastScreenButton);

document.querySelector(".last-screen__button").addEventListener('click', () => {
  location.reload();  
});



