
function CheckersStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    GameStateMachine.call(this, gamePieces, player1, player2, pieceNamespace, myPlayer);
    this.forcedPiece = null;
}

function NormalCheckersStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    CheckersStateMachine.call(this, gamePieces, player1, player2, pieceNamespace, myPlayer);

    this.shouldActivate = function(game_piece) {
        if (GameStateMachine.prototype.shouldActivate.call(this, game_piece)) {
            if (game_piece.player.canJump()) {
                return game_piece.hasJumps();
            } 

            return true;
        }
        return false;
    }

    this.next = function(square) {
        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.gamePieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.activePiece.i == square.i && this.activePiece.j == square.j && this.forcedPiece == null) {
            this.deactivate();
            return;
        }

        var move = null;
        var isJump = false;
        var isValidMove = false;

        if (this.activePiece.hasJumps()) {
            if (this.activePiece.isValidJump(square.i, square.j)) {
                isJump = true;
                isValidMove = true;
            }
        } else {
            isValidMove = this.activePiece.isValidMove(square.i, square.j);
        }
        
        if (isValidMove){
            move = this.makeMoveObject(square);
            this.lastMove = move;
            this.move(this.activePiece, square);
            if (isJump && this.activePiece.hasJumps()) {
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.gamePieces);
            } else {
                this.toggleTurn();
                this.forcedPiece = null;
                this.deactivate();
            }
        } 
        
        if (this.isGameOver()){
            console.log("Game over!");
        }
        return move;
    }
}

function WeirdCheckersStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    CheckersStateMachine.call(this,gamePieces, player1, player2, pieceNamespace, myPlayer);

    this.shouldActivate = function(gamePiece) {
        if (! GameStateMachine.prototype.shouldActivate.call(this, gamePiece)) return false;
        if (this.myPlayer.indexOf(gamePiece.player) == -1) return false;
        if (this.isTurnStrict(gamePiece.player)) return true;
        if (gamePiece === this.forcedPiece) return true;
        if (this.isTurn(gamePiece.player) && gamePiece.color != this.forcedPiece.color) return true;
        return false;
    }

    this.next = function(square) {
        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.gamePieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.activePiece.i == square.i && this.activePiece.j == square.j) {
            this.deactivate();
            return;
        }
        var move = null;
        var isValidMove;
        var isJump = this.activePiece.isValidJump(square.i, square.j);

        if (this.forcedPiece === this.activePiece) {
            isValidMove = isJump;
        } else {
            isValidMove = this.activePiece.isValidMove(square.i, square.j);
        }

        if (isValidMove){

            move = this.makeMoveObject(square);
            this.lastMove = move;
            this.move(this.activePiece, square);

            if (isJump && this.activePiece.hasJumps()) {
                this.whoseTurn = 'both';
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.gamePieces);
            } else {
                this.toggleTurn();
                this.forcedPiece = null;
                this.deactivate();
            }
        } 

        if (this.isGameOver()){
            console.log("Game over!");
        }

        return move;
    }
}



CheckersStateMachine.prototype = Object.create(GameStateMachine.prototype);
CheckersStateMachine.prototype.isGameOver = function() {
    if (this.gamePieces.length < 2) return true; 

    var colour = this.gamePieces[0].color;

    for (var i = 0; i < this.gamePieces.length; i++){
        if (this.gamePieces[i].color !== colour) return false;
    }

    return true;
};




WeirdCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
WeirdCheckersStateMachine.prototype.makeMove = function(from, to) {
    var piece = getGamePiece(this.gamePieces, from.i, from.j);
    var isJump = piece.isValidJump(to.i, to.j);

    this.move(piece, to);
    if (isJump && piece.hasJumps()) {
        this.whoseTurn = 'both';
        this.forcedPiece = piece;
        drawing.drawBoard();
        drawing.drawPieces(this.gamePieces);
    } else {
        this.toggleTurn();
        this.forcedPiece = null;
        this.deactivate(piece);
    }
};



NormalCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
NormalCheckersStateMachine.prototype.makeMove = function(from, to) {
    var piece = getGamePiece(this.gamePieces, from.i, from.j);
    var isJump = piece.isValidJump(to.i, to.j);

    this.move(piece, to);
    if (isJump && piece.hasJumps()) {
        this.forcedPiece = piece;
        drawing.drawBoard();
        drawing.drawPieces(this.gamePieces);
    } else {
        this.toggleTurn();
        this.forcedPiece = null;
        this.deactivate(piece);
    }
};