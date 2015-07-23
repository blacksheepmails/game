function ChessStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    GameStateMachine.call(this, game_pieces, player1, player2, pieceNamespace, myPlayer);
}

function NormalChessStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    ChessStateMachine.call(this, game_pieces, player1, player2, pieceNamespace, myPlayer);

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
        var move = null;
        this.updatePossibleMoves();
        var isValidMove = this.isValidMove(this.activePiece, square.i, square.j);
        
        if (isValidMove){
            this.activePiece.player.updateCanCastle(this.activePiece);
            move = this.makeMoveObject(square);
            this.lastMove = move;
            this.move(this.activePiece, square);
            this.toggleTurn();
            this.deactivate();
        } 

        if (this.isGameOver()){
            if (this.whoseTurn.isInCheck()) console.log(this.whoseTurn.color + 'lost');
            else console.log("draw!");
        }
        return move;
    }
}

ChessStateMachine.prototype = Object.create(GameStateMachine.prototype);
NormalChessStateMachine.prototype = Object.create(ChessStateMachine.prototype);
NormalChessStateMachine.prototype.isValidMove = function(piece, i, j) {
    if (!piece.isValidMove(i, j)) return false;
    return piece.player.isValidMove(piece, i, j, this);
};
NormalChessStateMachine.prototype.updatePossibleMoves = function() {
    ChessStateMachine.prototype.updatePossibleMoves.call(this);
    this.whoseTurn.addCastleMoves();
};
NormalChessStateMachine.prototype.isGameOver = function() {
    return !this.whoseTurn.canMove(this);
}