function Board(pos_x, pos_y, width, height) {
    this.width = width;
    this.height = height;
    this.pos_x = pos_x;
this.pos_y = pos_y;
    this.board = new Array(3);
    this.circle_radius = this.width / 12;
    this.x_line_size = this.width / 6;    
    this.win_id = -1; //The winning line/column/diagonal (0-2 - lines, 3-5 - columns, 6-7 - diagonals)    
    for (var i = 0; i < 3; i++) {
        this.board[i] = new Array(3);
        for (var j = 0; j < 3; j++) {
            this.board[i][j] = 0;
        }
    }
}

Board.prototype.MakeMove = function (row, column, player_id) {       
    var valid = (this.board[row][column] === 0);
    if (this.board[row][column] == 0) {
        this.board[row][column] = player_id;        
    }
    return valid;
}

Board.prototype.ConvertMousePosToBoard = function (mouse_x, mouse_y) {
    var column = 0;
    var row = 0;    
    if (mouse_x <= this.pos_x + (this.width / 3)) {
       column = 0;
    } else if (mouse_x <= this.pos_x + (2 * (this.width / 3))) {
       column = 1;
    } else{
       column = 2;
    }
    if (mouse_y <= this.pos_y + (this.height / 3)) {
       row = 0;
    } else if (mouse_y <= this.pos_y + (2 * (this.height / 3))) {
       row = 1;
    } else{
       row = 2;
    }
    return [row,column];
}

Board.prototype.CheckWin = function () {   
    var win = false;
    for (var i = 0; i < 3; i++) {        
        if (this.board[i][0] != 0 && this.board[i][0] == this.board[i][1] && this.board[i][0] == this.board[i][2]) {
            win = true;
            this.win_id = i;
            return win;            
        }
    }
    for (var i = 0; i < 3; i++) {
        if (this.board[0][i] != 0 && this.board[0][i] == this.board[1][i] && this.board[0][i] == this.board[2][i]) {
            win = true;
            this.win_id = i + 3;
            return win;            
        }
    }
    if (this.board[0][0] != 0 && this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2]) {
        win = true;
        this.win_id = 6;
        return win;
    }
    if (this.board[0][2] != 0 && this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0]) {
        win = true;
        this.win_id = 7;
        return win;
    }
    return win;   
}

Board.prototype.HasValidMoves = function()
{
    valid_moves = false;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (this.board[i][j] == 0) {
                valid_moves = true;
                break;
            }
        }
    }
    return valid_moves;
}

Board.prototype.Reset = function () {
    for (var i = 0; i < 3; i++) {       
        for (var j = 0; j < 3; j++) {
            this.board[i][j] = 0;
        }
    }
    this.win_id = -1;
}

Board.prototype.Draw = function () {
    CONTEXT.strokeStyle = "#000000";
    CONTEXT.lineWidth = 2;
    CONTEXT.strokeRect(this.pos_x, this.pos_y,
        this.width, this.height);
    for (var i = 0; i < 2; i++) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(this.pos_x + (i + 1) * (this.width / 3), this.pos_y);
        CONTEXT.lineTo(this.pos_x + (i + 1) * (this.width / 3), this.pos_y + this.height);
        CONTEXT.stroke();

        CONTEXT.beginPath();
        CONTEXT.moveTo(this.pos_x, this.pos_y + (i + 1) * (this.height / 3));
        CONTEXT.lineTo(this.pos_x + this.width, this.pos_y + (i + 1) * (this.height / 3));
        CONTEXT.stroke();
    }

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var pos_row = this.pos_x + i * (this.height / 3) + (this.height / 6);
            var pos_column = this.pos_y + j * (this.width / 3) + (this.width / 6);
            if (this.board[i][j] == 1) {
                CONTEXT.beginPath();
                CONTEXT.arc(pos_column, pos_row, this.circle_radius, 0, 2 * Math.PI, false);
                CONTEXT.lineWidth = 2;
                CONTEXT.strokeStyle = '#003300';
                CONTEXT.stroke();
            } else if (this.board[i][j] == 2) {
		var x1 = pos_column - this.x_line_size / 2;
		var x2 = pos_column + this.x_line_size / 2;
                CONTEXT.beginPath();
                CONTEXT.moveTo(x1, pos_row - this.x_line_size / 2);
                CONTEXT.lineTo(x2, pos_row + this.x_line_size / 2);
                CONTEXT.lineWidth = 2;
                CONTEXT.strokeStyle = '#003300';
                CONTEXT.stroke();

                CONTEXT.beginPath();
                CONTEXT.moveTo(x2, pos_row - this.x_line_size / 2);
                CONTEXT.lineTo(x1, pos_row + this.x_line_size / 2);
                CONTEXT.lineWidth = 2;
                CONTEXT.strokeStyle = '#003300';
                CONTEXT.stroke();
            }
        }
    }
    if (GAME_FINISHED) {
        if (this.win_id <= 2) {            
            var pos_row = this.pos_y + this.win_id * (this.height / 3) + (this.height / 6);

            CONTEXT.beginPath();
            CONTEXT.moveTo(this.pos_x + (this.width / 6), pos_row);
            CONTEXT.lineTo(this.pos_x + this.width - (this.width / 6), pos_row);
            CONTEXT.lineWidth = 2;
            CONTEXT.strokeStyle = '#FF0000';
            CONTEXT.stroke();
        } else if (this.win_id <= 5) {
            var pos_column = this.pos_x + (this.win_id - 3) * (this.width / 3) + (this.width / 6);

            CONTEXT.beginPath();
            CONTEXT.moveTo(pos_column, this.pos_y + (this.height / 6));
            CONTEXT.lineTo(pos_column, this.pos_y + this.height - (this.height / 6));
            CONTEXT.lineWidth = 2;
            CONTEXT.strokeStyle = '#FF0000';
            CONTEXT.stroke();

        } else if (this.win_id == 6) {
            CONTEXT.beginPath();
            CONTEXT.moveTo(this.pos_x + (this.width / 6), this.pos_y + (this.height / 6));
            CONTEXT.lineTo(this.pos_x + 2 * (this.width / 3) + (this.width / 6),this.pos_y + 2 * (this.height / 3) + (this.height / 6));
            CONTEXT.lineWidth = 2;
            CONTEXT.strokeStyle = '#FF0000';
            CONTEXT.stroke();
        } else {
            CONTEXT.beginPath();
            CONTEXT.moveTo(this.pos_x + 2 * (this.width / 3) + (this.width / 6),this.pos_y + (this.height / 6));
            CONTEXT.lineTo(this.pos_x + (this.width / 6), this.pos_y +  2 * (this.height / 3) + (this.height / 6));
            CONTEXT.lineWidth = 2;
            CONTEXT.strokeStyle = '#FF0000';
            CONTEXT.stroke();
        }
    }
}
