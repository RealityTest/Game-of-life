var c = document.getElementById("canvas");
var cTop = document.getElementById("canvas_top");
var ctx = c.getContext("2d");
var ctxTop = cTop.getContext("2d");
var cellSize = 5;
var gridHeight = Math.floor((window.innerHeight / cellSize) * 0.8);
var gridWidth = Math.floor((window.innerWidth / cellSize) * 0.8);
var generation = 0;
var cells = createArray(gridWidth);
var cellsMirror = createArray(gridWidth);

function createArray(rows){
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}

//Fill arrays randomly with 1s (living cell) and 0s (dead cell)
function fillRandom() { 
    for (var i = 0; i < gridWidth; i++) { 
        for (var j = 0; j < gridHeight; j++) { 
            if(Math.random() > 0.8){
                cells[i][j] = 1;
                cellsMirror[i][j] = 1;
            }
            else{
                cells[i][j] = 0;
                cellsMirror[i][j] = 0;
            }
        }
    }
}

function fillEmpty(){
    for (var i = 0; i < gridWidth; i++) { 
        for (var j = 0; j < gridHeight; j++) { 
            cells[i][j] = 0;
        }
    }
}


var drawLines = false;

var btnGrid = document.getElementById("btn_grid");
btnGrid.onclick = function(e){
    drawLines = !drawLines;
    if(drawLines){
        drawGridLines();
    }
    else{
        ctxTop.clearRect(0, 0, c.width, c.height); 
    }
}

function drawGrid(){
    ctx.clearRect(0, 0, c.width, c.height);
    for(var i = 0; i < cells.length; i++){
        for(var j = 0; j < cells[0].length; j++){
            ctx.fillStyle = "#2BC016";
            if(cells[i][j]){
                ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawGridLines() {
    ctxTop.clearRect(0, 0, c.width, c.height);
    ctxTop.lineWidth = 0.5;
    ctxTop.strokeStyle = "#d3d3d3";
    ctxTop.beginPath();
    for (var i = 0; i < cells.length; i++) {
        ctxTop.moveTo(i*cellSize, 0);
        ctxTop.lineTo(i*cellSize, gridHeight*cellSize);
    }
    // foreach row
    for (var j = 0; j <= cells[0].length; j++) {
        ctxTop.moveTo(0, j*cellSize);
        ctxTop.lineTo(gridWidth*cellSize, j*cellSize);
    }
    ctxTop.stroke();
  }

var generationCounter = document.getElementById("generation_count");
function updateGeneration(){
    generation++;
    generationCounter.innerHTML = "Generation: " + generation;
}

function updateGrid(){
    for(var i = 0; i < cells.length; i++){
        for(var j = 0; j < cells[0].length; j++){
            var surroundingCells = 0;

            if(i > 0){
                if(j > 0){
                    surroundingCells += cells[i - 1][j - 1]; //top left
                }
                surroundingCells += cells[i - 1][j]; //top center
                if(j < cells[0].length - 1){
                    surroundingCells += cells[i - 1][j + 1]; //top right
                }
            }
            if(j > 0){
                surroundingCells += cells[i][j - 1]; //middle left
            }
            if(j < cells[0].length - 1){
                surroundingCells += cells[i][j + 1]; //middle right
            }
            if(i < cells.length - 1){
                if(j > 0){
                    surroundingCells += cells[i + 1][j - 1]; //bottom left
                }
                surroundingCells += cells[i + 1][j]; //bottom center
                if(j < cells[0].length - 1){
                    surroundingCells += cells[i + 1][j + 1]; //bottom right
                }
            }
            

            if(!cells[i][j]){
                switch (surroundingCells) {
                    case 3:
                        cellsMirror[i][j] = 1; //if cell is dead and has 3 neighbours, switch it on
                        break;
                    default:
                        cellsMirror[i][j] = 0; //otherwise leave it dead
                }
            }
            else{
                switch (surroundingCells) {
                    case 0:
                    case 1:
                        cellsMirror[i][j] = 0; //die of loneliness
                        break;
                    case 2:
                    case 3:
                        cellsMirror[i][j] = 1; //carry on living
                        break;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        cellsMirror[i][j] = 0; //die of overcrowding
                        break;
                    default:
                        cellsMirror[i][j] = 0; //
                }
            }
        }
    }

    for (var i = 0; i < cellsMirror.length; i++) { //iterate through rows
        for (var j = 0; j < cellsMirror[0].length; j++) { //iterate through columns
            cells[i][j] = cellsMirror[i][j];
        }
    }
}

var mouseDown = false;
var mouseBtn;
cTop.addEventListener('contextmenu', event => event.preventDefault());
cTop.onmousedown = function(e){
    mouseDown = true;
    mouseBtn = e.button;
    var x = event.offsetX;
    var y = event.offsetY;
    if(mouseBtn == 0){
        ctx.fillRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
        cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 1;
    }
    else{
        ctx.clearRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
        cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 0;
    }
    console.log("x coords: " + x + ", y coords: " + y);
}
cTop.onmousemove = function(e){
    if(mouseDown){
        var x = event.offsetX;
        var y = event.offsetY;
        if(mouseBtn == 0){
            ctx.fillRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
            cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 1;
        }
        else{
            ctx.clearRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
            cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 0;
        }
    }
}
cTop.onmouseup = function(e){
    mouseDown = false;
}


var paused = false;
var pauseBtn = document.getElementById("btn_pause");
pauseBtn.onclick = function(e){
    if(paused){
        unpauseGame();
    }
    else{
        pauseGame();
    }
}
var clearBtn = document.getElementById("btn_clear");
clearBtn.onclick = function(e){
    generation = 0;
    updateGeneration();
    for(var i = 0; i < cells.length; i++){
        for(var j = 0; j < cells[0].length; j++){
            cells[i][j] = 0;
            ctx.clearRect(0, 0, c.width, c.height);
        }
    }
    if(drawLines){
        drawGridLines();
    }
    //Pause on Clear
    pauseGame();
}

var randomBtn = document.getElementById("btn_random");
randomBtn.onclick = function(e){
    pauseGame();
    fillRandom();
    drawGrid();
    generation = 0;
    updateGeneration();
}

function pauseGame(){
    paused = true;
    pauseBtn.innerHTML = "Resume";
    pauseBtn.style.backgroundColor = "#C9302C";
}

function unpauseGame(){
    paused = false;
    pauseBtn.innerHTML = "Pause";
    pauseBtn.style.backgroundColor = "#4CAF50";
}

function run(){
    if(!paused){
        updateGrid();
        drawGrid();
        updateGeneration();
    }
    requestAnimationFrame(run);
}

fillRandom();
c.setAttribute("height", gridHeight * cellSize);
c.setAttribute("width", gridWidth * cellSize);
cTop.setAttribute("height", gridHeight * cellSize);
cTop.setAttribute("width", gridWidth * cellSize);
run();



