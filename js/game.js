//GLOBAL VARIABLES
var CANVAS;
var CONTEXT;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var BOARD_BORDER_SIZE = 10;
var BOARD_WIDTH = CANVAS_WIDTH;
var BOARD_HEIGHT = CANVAS_HEIGHT;
var CURRENT_PLAYER = 1;
var AI_ON = 0;
var GAME_FINISHED = false;
var WINNER = -1; // 0 = Draw

function SetupGame() {
    CANVAS = document.getElementById("game_canvas");
    CONTEXT = CANVAS.getContext("2d");
    CANVAS.width = CANVAS_WIDTH;
    CANVAS.height = CANVAS_HEIGHT;

    CANVAS.addEventListener('mousedown', function (evt) {
        if (!GAME_FINISHED) {
            var mouse_click_pos = OnMouseClick(evt);
            MakeMove(mouse_click_pos.x, mouse_click_pos.y);
        } else {            
            Reset();
            Update();
        }
    }, false);
}

function ClearScreen() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.fillStyle = "#FFFFFF";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

function Update() {
    ClearScreen();
    board.Draw();    
}

function Reset() {    
    GAME_FINISHED = false;
    board.Reset();
    CURRENT_PLAYER = 1;
    Update();
}

function OnMouseClick(evt) {
    var rect = CANVAS.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function MakeMove(x, y) {   
    var valid = this.board.MakeMove(x, y, CURRENT_PLAYER);
    if (valid) {
        CheckWin();
        AlternatePlayers();
        Update();
    }   
}

function CheckWin() {
    if (board.CheckWin()) {
        GAME_FINISHED = true;
        WINNER = CURRENT_PLAYER;
    } else if(!board.HasValidMoves()) {
        GAME_FINISHED = true;
        WINNER = 0;
    }
}

function AlternatePlayers() {
    if (CURRENT_PLAYER === 1) {
        CURRENT_PLAYER = 2;
    } else {
        CURRENT_PLAYER = 1;
    }
}



function main() {
    SetupGame();
    board = new Board(CANVAS_WIDTH,CANVAS_HEIGHT);  
    Update();    
}

main();