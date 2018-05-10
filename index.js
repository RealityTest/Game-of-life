var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
var gridHeight = 200;
var gridWidth = 400;
var cellSize = 4;
var cells;

function createArray(){
    var cellArr = [];
    for(i = 0; i < gridWidth; i++){
        var tempArr = [];
        for(j = 0; j < gridHeight; j++){
            if(Math.random() > 0.85){
                tempArr.push(1);
            }
            else{
                tempArr.push(0);
            }
        }
        cellArr.push(tempArr);
    }
    cells = cellArr;
}

function drawGrid(){
    ctx.clearRect(0, 0, c.width, c.height);
    for(i = 0; i < cells.length; i++){
        for(j = 0; j < cells[0].length; j++){
            ctx.fillStyle = "#2BC016";
            if(cells[i][j]){
                ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
            }
        }
    }
}

function updateGrid(){
    for(i = 0; i < cells.length; i++){
        for(j = 0; j < cells[0].length; j++){
            if(cells[i][j]){
                cells[i][j] = 0;
                cells[i][j-1] = 1;
            }
        }
    }
}

c.onmousedown = function(e){
    var x = event.offsetX;
    var y = event.offsetY;
    ctx.fillRect(Math.floor(x/cellSize)*cellSize, Math.floor(y/cellSize)*cellSize, cellSize, cellSize);
    cells[Math.floor(x/cellSize)][Math.floor(y/cellSize)] = 1;
    console.log("x coords: " + x + ", y coords: " + y);
}

function run(){
    drawGrid();
    updateGrid();
    setTimeout(run, 50);
    //requestAnimationFrame(run);
}

createArray();
c.setAttribute("height", gridHeight * cellSize);
c.setAttribute("width", gridWidth * cellSize);
run();