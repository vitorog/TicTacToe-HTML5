//GLOBAL VARIABLES
var CANVAS;
var CONTEXT;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var BOARD_BORDER_SIZE = 10;
var BOARD_WIDTH = CANVAS_WIDTH / 2;
var BOARD_HEIGHT = CANVAS_HEIGHT / 2;
var STARTING_PLAYER = 1;
var AI_ON = 0;
var GAME_FINISHED = false;
var WINNER = -1;
// 0 = Draw
var BOARD_POS_X = 50;
var BOARD_POS_Y = 50;
var CIRCLE_RADIUS = BOARD_WIDTH / 12;
var X_LINE_SIZE = BOARD_WIDTH / 6;

var AI_PLAYER;
var CURRENT_GAME_STATE;

function SetupGame() {
	CANVAS = document.getElementById("game_canvas");
	CONTEXT = CANVAS.getContext("2d");
	CANVAS.width = CANVAS_WIDTH;
	CANVAS.height = CANVAS_HEIGHT;

	CANVAS.addEventListener('mousedown', function(evt) {
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
	DrawGameInfo();
	DrawBoard();
}

function Reset() {
	GAME_FINISHED = false;
	STARTING_PLAYER = 1;
	CURRENT_GAME_STATE.Reset(STARTING_PLAYER);
	Update();
}

function OnMouseClick(evt) {
	var rect = CANVAS.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}

function ConvertMousePosToBoardPos(mouse_x, mouse_y) {
	var column = 0;
	var row = 0;
	if (mouse_x <= BOARD_POS_X + (BOARD_WIDTH / 3)) {
		column = 0;
	} else if (mouse_x <= BOARD_POS_X + (2 * (BOARD_WIDTH / 3))) {
		column = 1;
	} else {
		column = 2;
	}
	if (mouse_y <= BOARD_POS_Y + (BOARD_HEIGHT / 3)) {
		row = 0;
	} else if (mouse_y <= BOARD_POS_Y + (2 * (BOARD_HEIGHT / 3))) {
		row = 1;
	} else {
		row = 2;
	}
	return [row, column];
}


function MakeMove(mouse_x, mouse_y) {
	// if ((AI_ON && CURRENT_PLAYER == 2) || mouse_x < BOARD_POS_X || mouse_x > BOARD_POS_X + BOARD_WIDTH || mouse_y < BOARD_POS_Y || mouse_y > BOARD_POS_Y + BOARD_HEIGHT) {
		// return;
	// }
	var board_pos = ConvertMousePosToBoardPos(mouse_x, mouse_y);
	row = board_pos[0];
	column = board_pos[1];
	if(CURRENT_GAME_STATE.board[row][column] == 0){
		CURRENT_GAME_STATE.MakeMove(row,column);
		var game_over = CURRENT_GAME_STATE.IsGameOver();		
		if(game_over == -1){
			CURRENT_GAME_STATE.AlternatePlayers();
		}else{				
			GAME_FINISHED = true;
			if(game_over != 0){
				WINNER = CURRENT_GAME_STATE.current_player;
			}else{
				WINNER = 0;
			}
		}
	}	
	Update();	
}

function DrawGameInfo() {
	CONTEXT.fillStyle = "black";
	CONTEXT.font = "bold 24px Arial";
	if (!GAME_FINISHED) {
		CONTEXT.fillText("Current player: " + parseInt(CURRENT_GAME_STATE.current_player), 50, 30);
		if (CURRENT_GAME_STATE.current_player == 1) {
			CONTEXT.beginPath();
			CONTEXT.arc(265, 22, 10, 0, 2 * Math.PI, false);
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#003300';
			CONTEXT.stroke();
		} else {
			CONTEXT.beginPath();
			CONTEXT.moveTo(255, 15);
			CONTEXT.lineTo(275, 30);
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#003300';
			CONTEXT.stroke();

			CONTEXT.beginPath();
			CONTEXT.moveTo(275, 15);
			CONTEXT.lineTo(255, 30);
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#003300';
			CONTEXT.stroke();
		}
	} else {
		CONTEXT.fillText("Player " + parseInt(CURRENT_GAME_STATE.current_player) + " Wins! Click to restart!", 50, 30);
	}
}

function DrawBoard() {
	var win_state = CURRENT_GAME_STATE.win_state;
	CONTEXT.strokeStyle = "#000000";
	CONTEXT.lineWidth = 2;
	CONTEXT.strokeRect(BOARD_POS_X, BOARD_POS_Y, BOARD_WIDTH, BOARD_HEIGHT);
	for (var i = 0; i < 2; i++) {
		CONTEXT.beginPath();
		CONTEXT.moveTo(BOARD_POS_X + (i + 1) * (BOARD_WIDTH / 3), BOARD_POS_Y);
		CONTEXT.lineTo(BOARD_POS_X + (i + 1) * (BOARD_WIDTH / 3), BOARD_POS_Y + BOARD_HEIGHT);
		CONTEXT.stroke();

		CONTEXT.beginPath();
		CONTEXT.moveTo(BOARD_POS_X, BOARD_POS_Y + (i + 1) * (BOARD_HEIGHT / 3));
		CONTEXT.lineTo(BOARD_POS_X + BOARD_WIDTH, BOARD_POS_Y + (i + 1) * (BOARD_HEIGHT / 3));
		CONTEXT.stroke();
	}

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var pos_row = BOARD_POS_X + i * (BOARD_HEIGHT / 3) + (BOARD_HEIGHT / 6);
			var pos_column = BOARD_POS_Y + j * (BOARD_WIDTH / 3) + (BOARD_WIDTH / 6);
			if (CURRENT_GAME_STATE.board[i][j] == 1) {
				CONTEXT.beginPath();
				CONTEXT.arc(pos_column, pos_row, CIRCLE_RADIUS, 0, 2 * Math.PI, false);
				CONTEXT.lineWidth = 2;
				CONTEXT.strokeStyle = '#003300';
				CONTEXT.stroke();
			} else if (CURRENT_GAME_STATE.board[i][j] == 2) {
				var x1 = pos_column - X_LINE_SIZE / 2;
				var x2 = pos_column + X_LINE_SIZE / 2;
				CONTEXT.beginPath();
				CONTEXT.moveTo(x1, pos_row - X_LINE_SIZE / 2);
				CONTEXT.lineTo(x2, pos_row + X_LINE_SIZE / 2);
				CONTEXT.lineWidth = 2;
				CONTEXT.strokeStyle = '#003300';
				CONTEXT.stroke();

				CONTEXT.beginPath();
				CONTEXT.moveTo(x2, pos_row - X_LINE_SIZE / 2);
				CONTEXT.lineTo(x1, pos_row + X_LINE_SIZE / 2);
				CONTEXT.lineWidth = 2;
				CONTEXT.strokeStyle = '#003300';
				CONTEXT.stroke();
			}
		}
	}
	if (GAME_FINISHED) {
		if (win_state <= 2) {
			var pos_row = BOARD_POS_Y + win_state * (BOARD_HEIGHT / 3) + (BOARD_HEIGHT / 6);

			CONTEXT.beginPath();
			CONTEXT.moveTo(BOARD_POS_X + (BOARD_WIDTH / 6), pos_row);
			CONTEXT.lineTo(BOARD_POS_X + BOARD_WIDTH - (BOARD_WIDTH / 6), pos_row);
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#FF0000';
			CONTEXT.stroke();
		} else if (win_state <= 5) {
			var pos_column = BOARD_POS_X + (win_state - 3) * (BOARD_WIDTH / 3) + (BOARD_WIDTH / 6);

			CONTEXT.beginPath();
			CONTEXT.moveTo(pos_column, BOARD_POS_Y + (BOARD_HEIGHT / 6));
			CONTEXT.lineTo(pos_column, BOARD_POS_Y + BOARD_HEIGHT - (BOARD_HEIGHT / 6));
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#FF0000';
			CONTEXT.stroke();

		} else if (win_state == 6) {
			CONTEXT.beginPath();
			CONTEXT.moveTo(BOARD_POS_X + (BOARD_WIDTH / 6), BOARD_POS_Y + (BOARD_HEIGHT / 6));
			CONTEXT.lineTo(BOARD_POS_X + 2 * (BOARD_WIDTH / 3) + (BOARD_WIDTH / 6), BOARD_POS_Y + 2 * (BOARD_HEIGHT / 3) + (BOARD_HEIGHT / 6));
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#FF0000';
			CONTEXT.stroke();
		} else {
			CONTEXT.beginPath();
			CONTEXT.moveTo(BOARD_POS_X + 2 * (BOARD_WIDTH / 3) + (BOARD_WIDTH / 6), BOARD_POS_Y + (BOARD_HEIGHT / 6));
			CONTEXT.lineTo(BOARD_POS_X + (BOARD_WIDTH / 6), BOARD_POS_Y + 2 * (BOARD_HEIGHT / 3) + (BOARD_HEIGHT / 6));
			CONTEXT.lineWidth = 2;
			CONTEXT.strokeStyle = '#FF0000';
			CONTEXT.stroke();
		}
	}
}

function main() {
	SetupGame();
	CURRENT_GAME_STATE = new GameState(STARTING_PLAYER);
	AI_PLAYER = new AiPlayer();
	Update();
}

main();
