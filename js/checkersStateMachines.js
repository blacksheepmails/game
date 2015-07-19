
function CheckersStateMachine(game_pieces, player1, player2, piecesNamespace) {
    GameStateMachine.call(this, game_pieces, player1, player2, piecesNamespace);
    this.forcedPiece = null;
}

function NormalCheckersStateMachine(game_pieces, player1, player2, piecesNamespace) {
    CheckersStateMachine.call(this, game_pieces, player1, player2, piecesNamespace);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurnStrict(game_piece.player)) {

            if (game_piece.player.canJump()) {
                return game_piece.hasMoreJumps();
            } else {
                return true;
            }
        }
        return false;
    }

    this.next = function(square) {

        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.game_pieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.activePiece.i == square.i && this.activePiece.j == square.j && this.forcedPiece == null) {
            this.deactivate();
            return;
        }

        var isJump = false;
        var isValidMove = false;

        if (this.activePiece.hasMoreJumps()) {
            if (this.activePiece.isValidJump(square.i, square.j)) {
                isJump = true;
                isValidMove = true;
            }
        } else {
            isValidMove = this.activePiece.isValidMove(square.i, square.j);
        }
        
        if (isValidMove){
            this.activePiece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
            this.activePiece.i = square.i;
            this.activePiece.j = square.j;
            if (isJump && this.activePiece.hasMoreJumps()) {
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.game_pieces);
            } else {
                this.toggleTurn();
                this.forcedPiece = null;
                this.deactivate();
            }
        } 
        
        if (this.isGameOver()){
            console.log("Game over!");
        }
    }
}

function WeirdCheckersStateMachine(game_pieces, player1, player2, piecesNamespace) {
    CheckersStateMachine.call(this,game_pieces, player1, player2, piecesNamespace);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurnStrict(game_piece.player)) return true;
        if (game_piece === this.forcedPiece) return true;
        if (this.isTurn(game_piece.player) && game_piece.color != this.forcedPiece.color) return true;
        return false;
    }

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

        var isValidMove;
        if (this.forcedPiece === this.activePiece) {
            isJump = this.activePiece.isValidJump(square.i, square.j);
            isValidMove = isJump;
        } else {
            isValidMove = this.activePiece.isValidMove(square.i, square.j);
            isJump = this.activePiece.isValidJump(square.i, square.j);
        }

        if (isValidMove){
            this.activePiece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
            this.activePiece.i = square.i;
            this.activePiece.j = square.j;
            if (isJump && this.activePiece.hasMoreJumps()) {
                this.whoseTurn = 'both';
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.game_pieces);
            } else {
                this.toggleTurn();
                this.forcedPiece = null;
                this.deactivate();
            }
        } 
        if (this.isGameOver()){
            console.log("Game over!");
        }
    }
}

CheckersStateMachine.prototype = Object.create(GameStateMachine.prototype);
CheckersStateMachine.prototype.isGameOver = function() {
    if (this.game_pieces.length < 2) { return true; }
    var colour = this.game_pieces[0].color;
    for (var i = 0; i < this.game_pieces.length; i++){
        if (this.game_pieces[i].color !== colour) return false;
    }
    return true;
};

WeirdCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
NormalCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
