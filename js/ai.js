function AiPlayer(ai_player_id) {
	if(ai_player_id == 2){
		this.max = 2;
		this.min = 1;	
	}else{
		this.max = 1;
		this.min = 2;
	}
	this.best_row = -1;
	this.best_column = -1;
}

AiPlayer.prototype.MakeMove = function(game_state) {	
	this.MaxMove(game_state, 0);	
	return [this.best_row, this.best_column];
}

AiPlayer.prototype.MaxMove = function(game_state, depth) {
	if (game_state.IsGameOver() != -1) {
		return this.Evaluate(game_state, this.max);
	} else {
		var best_score = -99;
		var moves = game_state.GetValidMoves();
		for (var k = 0; k < moves.length; k++) {
			var new_game_state = new GameState(game_state.current_player);
			new_game_state.CopyGameState(game_state);
			var row = moves[k][0];
			var column = moves[k][1];
			new_game_state.current_player = this.max;			
			new_game_state.MakeMove(row, column);				
			var score = this.MinMove(new_game_state, depth + 1);					
			if (score > best_score) {
				if(depth == 0){
					this.best_row = row;
					this.best_column = column;	
				}	
				best_score = score;											
			}		
		}
		return best_score;
	}
}

AiPlayer.prototype.MinMove = function(game_state, depth) {
	if (game_state.IsGameOver() != -1) {
		return this.Evaluate(game_state, this.min);
	} else {
		var best_score = 99;
		var moves = game_state.GetValidMoves();
		for (var k = 0; k < moves.length; k++) {
			var new_game_state = new GameState(game_state.current_player);
			new_game_state.CopyGameState(game_state);
			var row = moves[k][0];
			var column = moves[k][1];	
			new_game_state.current_player = this.min;		
			new_game_state.MakeMove(row, column);				
			var score = this.MaxMove(new_game_state, depth + 1);				
			if (score < best_score) {
				best_score = score;				
			}		
		}
		return best_score;
	}
}



AiPlayer.prototype.Evaluate = function(game_state, player) 
{
	var game_over = game_state.IsGameOver();
	if(game_over == 0){
		return 0;
	}else{
		if(player == this.max){
			if(game_over == this.max){
				return 1;
			}else{
				return -1;
			}
		}else if(player == this.min){
			if(game_over == this.min){
				return -1;
			}else{
				return 1;
			}
		}		
	}	
}
