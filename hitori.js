//CAN SOLVE THIS!!
var puzzle1 = [
    [5,6,4,7,6,2,2,3],
    [6,6,8,7,4,5,1,7],
    [5,7,3,2,7,6,2,5],
    [2,3,4,6,1,4,8,4],
    [6,8,7,6,6,1,3,4],
    [7,7,5,8,8,3,3,1],
    [8,1,7,3,2,6,4,7],
    [6,4,2,1,7,8,5,6]
];

//CAN SOLVE THIS!!
var puzzle2 = [
    [1,1,3,4,2,1,8,7],
    [7,5,3,3,1,2,8,4],
    [7,4,2,4,3,4,7,8],
    [4,8,2,1,1,6,3,8],
    [7,3,8,2,4,7,7,1],
    [3,6,2,5,2,4,1,2],
    [6,8,5,8,7,2,2,1],
    [4,2,1,4,6,8,4,3]
];

//CAN SOLVE THIS, BUT TAKES TIME.... WELL NOT ANYMORE
//I FIXED BRUTEFORCE SO NOW ITS GOOD XD
var puzzle3 = [
    [9, 9, 6, 11, 11, 7, 3, 11, 1, 1, 8, 8],
    [1, 10, 2, 12, 7, 5, 7, 11, 6, 3, 9, 8],
    [4, 9, 7, 6, 7, 2, 1, 10, 9, 3, 5, 2],
    [6, 6, 6, 5, 11, 8, 1, 2, 8, 1, 12, 3],
    [9, 2, 5, 4, 2, 1, 12, 11, 7, 12, 6, 10],
    [3, 3, 6, 6, 9, 9, 7, 4, 8, 10, 7, 2],
    [4, 8, 2, 7, 6, 12, 6, 3, 3, 2, 4, 3],
    [8, 3, 12, 10, 11, 6, 11, 9, 2, 9, 7, 5],
    [2, 5, 5, 8, 3, 11, 5, 7, 9, 9, 1, 2],
    [3, 11, 1, 5, 8, 2, 4, 1, 3, 9, 2, 12],
    [7, 10, 4, 2, 3, 9, 6, 8, 12, 5, 1, 1],
    [11, 7, 8, 1, 4, 9, 10, 1, 5, 6, 3, 9]
]

var puzzle;

var viewState = 0;
var states = [];

var can = document.getElementById("lerret");
var c = can.getContext("2d");

var size; // hvor mange felt horizontalt og vertikalt? f.eks 5x5
var feltSize = 40; //hvor store feltene skal være

function tapLeft(){
    var num = viewState - 1;
    if (num <= 0) num = 0;
    setViewState(num);
}

function tapRight(){
    var num = viewState + 1;
    if (num >= states.length-1) num = states.length - 1;
    setViewState(num);
}

function tapLeftAll(){
    setViewState(0);
}

function tapRightAll(){
    setViewState(states.length-1);
}

function setViewState(num){
    viewState = num;
    var p = document.getElementById("viewState");
    p.innerHTML = num;
}

init(1);

function init(puzzleId){
    if (puzzleId == 1) puzzle = puzzle1;
    if (puzzleId == 2) puzzle = puzzle2;
    if (puzzleId == 3) puzzle = puzzle3;
    states = [];
    viewState = 0;
    size = puzzle.length;

    can.width = (size*feltSize);
    can.height = (size*feltSize);

    foralle(function(x, y){
        var val = puzzle[y][x];
        puzzle[y][x] = new felt(val);
    });

    addState();

    draw();
}

function draw(){

    //Reset hvert frame
    c.fillStyle = "green";
    c.fillRect(0,0,can.width,can.height);

    var puzzleState = states[viewState];

    //Tegn alle feltene
    foralle(function(x, y){
        var f = puzzleState[y][x];
        c.fillStyle = getColor(f.color);
        c.fillRect(x*feltSize, y*feltSize, feltSize, feltSize);
        c.font = (feltSize/2) + "px Verdana";
        c.fillStyle = (getColor(f.color)=="white") ? "black" : "white";
        var xpos = x*feltSize+feltSize/3;
        var ypos = y*feltSize+feltSize/1.5;
        //Om det er 2 characters så sentrer bedre
        if (f.num > 9) xpos =  x*feltSize+feltSize/5;
        c.fillText(f.num, xpos, ypos);
    });

    requestAnimationFrame(draw);
}

//Henter fargen i tekst basert på 0,1,2
function getColor(col){
    if      (col==2) return "grey";
    else if (col==1) return "white";
    else if (col==0) return "black";
}

function solve(){
    //Check if you have something between to equal numbers, that is white.
    checkMiddleOf2();
    //Check if you have something like 1,2,1,2,2 where the right-most 2 is black
    checkFor2And1();

    //while(!correct()){
        //resolveDuplicates();
        bruteforceSolution();
    //}
    setViewState(states.length-1);
}

function resolveDuplicates(){
    resolveDuplicatesRow();
    resolveDuplicatesCol();
}

function resolveDuplicatesRow(){
    for(var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for(var x=0; x<row.length; x++){
            if (numWhiteOrGrey(row,puzzle[y][x].num)>1){
                console.log("Repetions on row " + y);
                
            }
        }
    }
}

function resolveDuplicatesCol(){

}

function bruteforceSolution(){
    var bruteforces = 0;
    var greys = getGraySquares();
    var savefile = saveState();
    while(!correct()){
        bruteforces++;
        //loadState(savefile);
        for (var i=0; i<greys.length; i++){
            loadState(savefile);
            if (Math.random() < 0.5){
                setBlack(greys[i].y, greys[i].x);
                if (!allWhiteConnected()){
                    console.log("A black blocked the whites");
                    loadState(savefile);
                    setWhite(greys[i].y, greys[i].x);
                    savefile = saveState();
                    break;
                }
            }else{
                setWhite(greys[i].y, greys[i].x);
            }
        }
    }
    setGraysToWhite();
    console.log("Random bruteforce used",bruteforces,"timed");
}

function setGraysToWhite(){
    var greys = getGraySquares();
    for (var i=0; i<greys.length; i++){
        setWhite(greys[i].y, greys[i].x);
    }
}

function getGraySquares(){
    var greys = [];
    for (var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for (var x=0; x<row.length; x++){
            if (isGrey(x,y)){
                greys.push({x:x, y:y});
            }
        }
    }
    return greys;
}

function correct(){
    return noBlackConnected() && allWhiteConnected() && noRepetions();
}

function isWhite(x,y){
    try {
        var col = puzzle[y][x].color;
        return (col == 1);
    }catch(e){
        return false;
    }
}
function isGrey(x,y){
    try {
        var col = puzzle[y][x].color;
        return (col == 2);
    }catch(e){
        return false;
    }
}
function isWhiteOrGray(x,y){
    try {
        var col = puzzle[y][x].color;
        return (col == 1 || col == 2);
    }catch(e){
        return false;
    }
}
function isBlack(x,y){
    try {
        var col = puzzle[y][x].color;
        return (col == 0);
    }catch(e){
        return false;
    }
}

function noBlackConnected(){
    var b = true;
    for(var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for(var x=0; x<row.length; x++){
            if (isBlack(x,y)){
                var p = true;
                if (isBlack(x+1, y)) p = false;
                if (isBlack(x-1, y)) p = false;
                if (isBlack(x, y+1)) p = false;
                if (isBlack(x, y-1)) p = false;
                if (!p) console.log("Black square at (" + x + "," + y + ") is connected to another black");
                if (!p) b = p;
            }
        }
    }
    return b;
}

function noRepetions(){
    return noRepetionsRows() && noRepetionsCols();
}

function noRepetionsRows(){
    for(var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for(var x=0; x<row.length; x++){
            if (numWhiteOrGrey(row,puzzle[y][x].num)>1){
                console.log("Repetions on row " + y);
                return false;
            }
        }
    }
    return true;
}

function noRepetionsCols(){
    for(var y=0; y<puzzle.length; y++){
        var col = getCol(y);
        for(var x=0; x<col.length; x++){
            if (numWhiteOrGrey(col,puzzle[x][y].num)>1){
                console.log("Repetions on col " + y);
                return false;
            }
        }
    }
    return true;
}

function allWhiteConnected(){
    var numWhite = countAndResetAllWhite();
    var firstWhite = findFirstWhite();
    var stack = [firstWhite];
    var numChecked = 0;
    while(stack.length > 0){
        var top = stack.pop();
        if (!puzzle[top.y][top.x].checked) numChecked++;
        puzzle[top.y][top.x].checked = true;
        if (!isChecked(top.x+1, top.y) && isWhiteOrGray(top.x+1, top.y)) stack.push({x:top.x+1, y:top.y});
        if (!isChecked(top.x-1, top.y) && isWhiteOrGray(top.x-1, top.y)) stack.push({x:top.x-1, y:top.y});
        if (!isChecked(top.x, top.y+1) && isWhiteOrGray(top.x, top.y+1)) stack.push({x:top.x, y:top.y+1});
        if (!isChecked(top.x, top.y-1) && isWhiteOrGray(top.x, top.y-1)) stack.push({x:top.x, y:top.y-1});
    }
    var b = (numWhite==numChecked);
    if (!b) console.log("Not all white squares are connected");
    return b;
}

function isChecked(x, y){
    try {
        return puzzle[y][x].checked;
    }catch(e){
        return true;
    }
}

function findFirstWhite(){
    var b = {x:0, y:0};
    foralle(function(x,y){
        if (puzzle[y][x].color == 1 || puzzle[y][x].color == 2){
            b.x = x;
            b.y = y;
        }
    });
    return b;
}

function countAndResetAllWhite(){
    var num = 0;
    for (var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for (var x=0; x<row.length; x++){
            puzzle[y][x].checked = false;
            if (puzzle[y][x].color == 1 || puzzle[y][x].color == 2) num++;
        }
    }
    return num;
}

function checkMiddleOf2(){
    checkMiddleOf2_col();
    checkMiddleOf2_row();
}

function checkMiddleOf2_col(){
    for (var y=0; y<puzzle.length; y++){
        var col = getCol(y);
        
        for (var x=0; x<col.length; x++){

            var tall = col[x].num;
            var tallToOver;

            try {
                tallToOver = col[x+2].num
            }catch(e){
                tallToOver = -1;
            }
            
            console.log(tall, tallToOver, "col");

            if (tall == tallToOver){
                setWhite(x+1, y);
            }
        }
    }
}

function checkMiddleOf2_row(){
    for (var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        for (var x=0; x<row.length; x++){

            var tall = row[x].num;
            var tallToOver;


            try {
                tallToOver = row[x+2].num
            }catch(e){
                tallToOver = -1;
            }

            console.log(tall, tallToOver, "row");

            if (tall == tallToOver){
                setWhite(y, x+1);
            }
        }
    }
}

function checkFor2And1(){
    checkFor2And1_col();
    checkFor2And1_row();
}



function checkFor2And1_row(){
    //Check each row
    for (var y=0; y<puzzle.length; y++){
        var row = getRow(y);
        var free = [];
        for (var x=0; x<row.length; x++){
            if (countInArray(row, row[x].num) == 3){
                var tallMidt = row[x].num;
                var tallVenstre;
                var tallHoyre;

                try {
                    tallVenstre = row[x-1].num
                }catch(e){
                    tallVenstre = -1;
                }

                try {
                    tallHoyre = row[x+1].num
                }catch(e){
                    tallHoyre = -1;
                }

                if (tallVenstre != tallMidt && tallHoyre != tallMidt){
                    free.push({x: x, y: y});
                }
            }
        }
        if (free.length == 1){
            setBlack(free[0].y, free[0].x);
        }
    }
}

function checkFor2And1_col(){
    //Check each row
    for (var y=0; y<puzzle.length; y++){
        var col = getCol(y);
        var free = [];
        for (var x=0; x<col.length; x++){
            if (countInArray(col, col[x].num) == 3){
                var tallMidt = col[x].num;
                var tallVenstre;
                var tallHoyre;

                try {
                    tallVenstre = col[x-1].num
                }catch(e){
                    tallVenstre = -1;
                }

                try {
                    tallHoyre = col[x+1].num
                }catch(e){
                    tallHoyre = -1;
                }

                if (tallVenstre != tallMidt && tallHoyre != tallMidt){
                    free.push({x: x, y:y});
                }
            }
        }
        if (free.length == 1){
            setBlack(free[0].x, free[0].y);
        }
    }
}

function EliminateWhiteRows(row, col){
    var fullRow = getRow(row);
    var num = puzzle[row][col].num;
    for (var i=0; i<fullRow.length; i++){
        if (fullRow[i].num == puzzle[row][col].num && i != col){
            setBlack(row, i);
        }
    }
}

function EliminateWhiteCols(row, col){
    var fullCol = getCol(col);
    var num = puzzle[row][col].num;
    for (var i=0; i<fullCol.length; i++){
        if (fullCol[i].num == puzzle[row][col].num && i != row){
            setBlack(i, col);
        }
    }
}

function setWhite(row, col){
    try { 
        if (puzzle[row][col].color != 2) return;
        puzzle[row][col].color = 1;

        addState();

        EliminateWhiteRows(row, col);
        EliminateWhiteCols(row, col);
    }catch(e){

    }
}

function setBlack(row, col){

    //test if you set one to black if all the whites are still connected.

    try { 
        if (puzzle[row][col].color != 2) return;
        puzzle[row][col].color = 0; 
    }catch(e){}

    addState();

    setWhite(row+1,col);
    setWhite(row-1,col);
    setWhite(row,col+1);
    setWhite(row,col-1);
}

//Klassen for hvert felt
function felt(val){
    this.num=val;
    this.checked = false;
    this.color=2;
    return this.num;
}

function getRow(x){
    return puzzle[x];
}

function getCol(x){
    var arr = [];
    for (var i=0; i<puzzle.length; i++){
        arr.push(puzzle[i][x]);
    }
    return arr;
}

function foralle(callback){
    for (var y=0; y<puzzle.length; y++){
        var row = puzzle[y];
        for (var x=0; x<row.length; x++){
            callback(x, y);
        }
    }
};

function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].num === what) {
            count++;
        }
    }
    return count;
}

function numWhiteOrGrey(array, what){
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].num === what && array[i].color != 0) {
            count++;
        }
    }
    return count;
}

function saveState(){
    return states.length-1;
}

function loadState(statenr){
    var state = states[statenr];
    puzzle = state;
    states.splice(statenr, states.length-1);
    addState();
}

function addState(){
    var arr = [];

    for (var y=0; y<puzzle.length; y++){
        var row = [];
        for (var x=0; x<puzzle.length; x++){
            row.push(0);
        }
        arr.push(row);
    }

    for (var y=0; y<puzzle.length; y++){
        var row = puzzle[y];
        for (var x=0; x<row.length; x++){
            var oldf = puzzle[y][x];
            var newf = new felt(oldf.num);
            newf.color = oldf.color;
            arr[y][x] = newf;
        }
    }

    states.push(arr);
    setViewState(states.length - 1);
}

function changePuzzle(sel){
    var sel = document.getElementById("mySel");
    var puzzleId = sel.options[sel.selectedIndex].value;
    init(puzzleId);
}

var tm;

function animateSolution(){
    if (states.length == 0 || states.length == 1) alert("The puzzle has to be solved in order to anime the solution!");
    setViewState(0);
    animate(0);
}

function continueAnimate(){
    if (states.length == 0 || states.length == 1) alert("The puzzle has to be solved in order to anime the solution!");
    animate(viewState);
}

function animate(num){
    console.log(num);
    if (num < states.length-1){
        var interval;
        var sel = document.getElementById("animSel");
        var time = sel.value;
        console.log(time);
        if (time == 1) interval = 4000;
        else if (time == 2) interval = 2000;
        else if (time == 3) interval = 1000;
        else if (time == 4) interval = 500;
        else if (time == 5) interval = 200;
        else if (time == 6) interval = 125;
        else if (time == 7) interval = 100;
        setViewState(num+1);
        tm = setTimeout(function(){animate(num+1)}, interval);
    }else{
        console.log("Im done");
    }
}

function stopAnimation(){
    clearTimeout(tm);
}

function changeSpeed(){
    stopAnimation();
    continueAnimate();
}

function lowerSize(){
    feltSize-=10;
    if (feltSize < 30) feltSize = 30;
    var span = document.getElementById("feltSize");
    span.innerHTML = feltSize;
    can.width = (size*feltSize);
    can.height = (size*feltSize);
}
function higherSize(){
    feltSize+=10;
    if (feltSize > 200) feltSize = 200;
    var span = document.getElementById("feltSize");
    span.innerHTML = feltSize;
    can.width = (size*feltSize);
    can.height = (size*feltSize);
}