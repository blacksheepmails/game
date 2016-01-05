function ChessStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    GameStateMachine.call(this, gamePieces, player1, player2, pieceNamespace, myPlayer);
}

function NormalChessStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    ChessStateMachine.call(this, gamePieces, player1, player2, pieceNamespace, myPlayer);

    this.next = function(square) {
        console.log('hereA');
        if (this.activePiece == null) {
            console.log('hereB');
            var game_piece = getGamePiece(this.gamePieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.isActivePiece(square)) {
            console.log('hereC');
            this.deactivate();
            return;
        }
        
        var move = null;
        var isValidMove = this.isValidMove(this.activePiece, square.i, square.j);
        if (isValidMove) {
            console.log('here1');
            this.activePiece.player.updateCanCastle(this.activePiece);
            move = this.makeMoveObject(square);
            this.lastMove = move;
            this.move(this.activePiece, square);
            console.log('here2');
            this.toggleTurn();
            this.deactivate();
            console.log('here3');
        } 

        if (this.isGameOver()) {
            if (this.whoseTurn.isInCheck()) console.log(this.whoseTurn.color + 'lost');
            else console.log("draw!");
        }
        return move;
    };
    
    this.isActivePiece = function(square) {
        return this.activePiece.i == square.i && this.activePiece.j == square.j;
    };
}

ChessStateMachine.prototype = Object.create(GameStateMachine.prototype);
ChessStateMachine.prototype.isGameOver = function() {
    return !this.whoseTurn.canMove(this);
};


NormalChessStateMachine.prototype = Object.create(ChessStateMachine.prototype);
NormalChessStateMachine.prototype.isValidMove = function(piece, i, j) {
    this.whoseTurn.addCastleMoves();
    if (!piece.isValidMove(i, j)) return false;
    return piece.player.isValidMove(piece, i, j, this);
};
NormalChessStateMachine.prototype.updatePossibleMoves = function() {
        console.log(this.gamePieces[0].i);

    ChessStateMachine.prototype.updatePossibleMoves.call(this);
    this.whoseTurn.addCastleMoves();
};