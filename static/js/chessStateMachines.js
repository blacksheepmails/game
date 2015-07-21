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

        var isValidMove = this.isValidMove(this.activePiece, square.i, square.j);
        
        if (isValidMove){
            this.activePiece.player.updateCanCastle(this.activePiece);
            this.activePiece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
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
NormalChessStateMachine.prototype.isValidMove = function(piece, i, j) {
    if (!piece.isValidMove(i, j)) return false;

    var old_i = piece.i;
    var old_j = piece.j;
    piece.i = i;
    piece.j = j;
    this.updatePossibleMoves();
    var returnVal = !this.whoseTurn.isInCheck()
    piece.i = old_i;
    piece.j = old_j;
    this.updatePossibleMoves();

    return returnVal;
};
NormalChessStateMachine.prototype.updatePossibleMoves = function() {
    ChessStateMachine.prototype.updatePossibleMoves.call(this);
    this.whoseTurn.addCastleMoves();
};
