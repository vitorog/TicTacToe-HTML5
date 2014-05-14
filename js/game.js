//GLOBAL VARIABLES
var CANVAS;
var CONTEXT;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var BOARD_BORDER_SIZE = 10;
var BOARD_WIDTH = CANVAS_WIDTH / 2;
var BOARD_HEIGHT = CANVAS_HEIGHT / 2;
var CURRENT_PLAYER = 1;
var AI_ON = 1;
var GAME_FINISHED = false;
var WINNER = -1; // 0 = Draw
var BOARD_POS_X = 50;
var BOARD_POS_Y = 50;
var AI_PLAYER;
var CURRENT_BOARD;

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
    CURRENT_BOARD.Draw();
	DrawGameInfo();
}

function Reset() {    
    GAME_FINISHED = false;
    CURRENT_BOARD.Reset();
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

function MakeMove(mouse_x, mouse_y) {   
if((AI_ON && CURRENT_PLAYER==2) || mouse_x < BOARD_POS_X || mouse_x > BOARD_POS_X + BOARD_WIDTH || mouse_y < BOARD_POS_Y || mouse_y > BOARD_POS_Y + BOARD_HEIGHT){
		return;
	}
    var board_pos = CURRENT_BOARD.ConvertMousePosToBoard(mouse_x, mouse_y);    
	 row = board_pos[0];
    column = board_pos[1];
	var valid = CURRENT_BOARD.MakeMove(row, column, CURRENT_PLAYER);
    if (valid) {
        CheckWin();
	if(!GAME_FINISHED){
	        AlternatePlayers();
	}
        Update();
    }   
}

function DrawGameInfo() {
	CONTEXT.fillStyle = "black";
	CONTEXT.font = "bold 24px Arial";
if(!GAME_FINISHED){
       CONTEXT.fillText("Current player: " + parseInt(CURRENT_PLAYER), 50, 30);
		if(CURRENT_PLAYER == 1){
		CONTEXT.beginPath();
                CONTEXT.arc(265, 22, 10, 0, 2 * Math.PI, false);
                CONTEXT.lineWidth = 2;
                CONTEXT.strokeStyle = '#003300';
                CONTEXT.stroke();
		}else{
			CONTEXT.beginPath();
		        CONTEXT.moveTo(255,15);
		        CONTEXT.lineTo(275,30);
		        CONTEXT.lineWidth = 2;
		        CONTEXT.strokeStyle = '#003300';
		        CONTEXT.stroke();

			CONTEXT.beginPath();
		        CONTEXT.moveTo(275,15);
		        CONTEXT.lineTo(255,30);
		        CONTEXT.lineWidth = 2;
		        CONTEXT.strokeStyle = '#003300';
		        CONTEXT.stroke();		 
		}
}else{
	
		  CONTEXT.fillText("Player " + parseInt(CURRENT_PLAYER) + " Wins! Click to restart!", 50,30); 
	}
}

function CheckWin() {
    if (CURRENT_BOARD.CheckWin()) {
        GAME_FINISHED = true;
        WINNER = CURRENT_PLAYER;
    } else if(!CURRENT_BOARD.HasValidMoves()) {
        GAME_FINISHED = true;
        WINNER = 0;
    }
}

function AlternatePlayers() {
    if (CURRENT_PLAYER === 1) {
        CURRENT_PLAYER = 2;
	if(AI_ON){
		move_pos = AI_PLAYER.MakeMove(CURRENT_BOARD);
		row = move_pos[0];
		column = move_pos[1];
		CURRENT_BOARD.MakeMove(row,column,CURRENT_PLAYER);
	}
    } else {
        CURRENT_PLAYER = 1;
    }
}



function main() {
    SetupGame();
    CURRENT_BOARD = new Board(BOARD_POS_X,BOARD_POS_Y,BOARD_WIDTH,BOARD_HEIGHT);  
    AI_PLAYER = new AiPlayer();
    Update();    
}

main();
