function ChessStateMachine(game_pieces, player1, player2, pieceNamespace) {
    GameStateMachine.call(this, game_pieces, player1, player2, pieceNamespace);
}

function NormalChessStateMachine(game_pieces, player1, player2, pieceNamespace) {
    ChessStateMachine.call(this, game_pieces, player1, player2, pieceNamespace);

    this.next = function(square) {
        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.game_pieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }
        if (this.activePiece.i == square.i && this.activePiece.j == square.j) {
            this.deactivate();
            return;
        }
        this.updatePossibleMoves();
        this.whoseTurn.addCastleMoves();

        var isValidMove = this.activePiece.isValidMove(square.i, square.j);
        
        if (isValidMove){

            this.activePiece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
            this.activePiece.player.updateCanCastle(this.activePiece);
            this.activePiece.i = square.i;
            this.activePiece.j = square.j;
            this.toggleTurn();
            this.deactivate();
        } 

        if (this.isGameOver()){
            console.log("Game over!");
        }
    }
}

ChessStateMachine.prototype = Object.create(GameStateMachine.prototype);
NormalChessStateMachine.prototype = Object.create(ChessStateMachine.prototype);
NormalChessStateMachine.prototype.isValidMove = function() {

};
