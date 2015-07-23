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
    return piece.player.isValidMove(piece, i, j);
    var old_i = piece.i;
    var old_j = piece.j;
    var effects = piece.getMove(i, j).sideEffects;
    var temp = null;
    for (var c = 0; c < effects.length; c++) {
        if (effects[c] instanceof this.pieceNamespace.Capture) {
            temp = effects[c].captured;
            effects[c].go();
        }
    }
    piece.i = i;
    piece.j = j;

    this.updatePossibleMoves();
    var returnVal = !this.whoseTurn.isInCheck()
    piece.i = old_i;
    piece.j = old_j;
    if (temp != null) this.game_pieces.push(temp);
    this.updatePossibleMoves();

    return returnVal;
};
NormalChessStateMachine.prototype.updatePossibleMoves = function() {
    ChessStateMachine.prototype.updatePossibleMoves.call(this);
    this.whoseTurn.addCastleMoves();
};
NormalChessStateMachine.prototype.isGameOver = function() {
    return !this.whoseTurn.canMove();
}