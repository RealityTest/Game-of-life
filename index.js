var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
var gridHeight = 150;
var gridWidth = 300;
var cellSize = 5;
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
            if(Math.random() > 0.6){
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

function drawGrid(){
    ctx.clearRect(0, 0, c.width, c.height);
    for(var i = 1; i < cells.length - 1; i++){
        for(var j = 1; j < cells[0].length - 1; j++){
            ctx.fillStyle = "#2BC016";
            if(cells[i][j]){
                ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
            }
        }
    }
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
                        cellsMirror[i][j] = 0; //die of lonelines
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

c.addEventListener('contextmenu', event => event.preventDefault());
c.onmousedown = function(e){
    var x = event.offsetX;
    var y = event.offsetY;
    if(e.button == 0){
        ctx.fillRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
        cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 1;
    }
    else{
        ctx.clearRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
        cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 0;
    }
    
    console.log("x coords: " + x + ", y coords: " + y);
}


var paused = false;
var pauseBtn = document.getElementById("btn_pause");
pauseBtn.onclick = function(e){
    if(paused){
        paused = false;
        pauseBtn.innerHTML = "Pause";
    }
    else{
        paused = true;
        pauseBtn.innerHTML = "Resume";
    }
}
var clearBtn = document.getElementById("btn_clear");
clearBtn.onclick = function(e){
    for(var i = 0; i < cells.length; i++){
        for(var j = 0; j < cells[0].length; j++){
            cells[i][j] = 0;
            ctx.clearRect(0, 0, c.width, c.height);
        }
    }
    //Pause on Clear
    paused = true;
    pauseBtn.innerHTML = "Resume";
}

function run(){
    if(!paused){
        drawGrid();
        updateGrid();
    }
    requestAnimationFrame(run);
}

fillRandom();
c.setAttribute("height", gridHeight * cellSize);
c.setAttribute("width", gridWidth * cellSize);
run();