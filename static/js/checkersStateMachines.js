
function CheckersStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    GameStateMachine.call(this, game_pieces, player1, player2, pieceNamespace, myPlayer);
    this.forcedPiece = null;
}

function NormalCheckersStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    CheckersStateMachine.call(this, game_pieces, player1, player2, pieceNamespace, myPlayer);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurn(game_piece.player) && this.isTurn(this.myPlayer)) {

            if (game_piece.player.canJump()) {
                return game_piece.hasMoreJumps();
            } else {
                return true;
            }
        }
        return false;
    }

    this.next = function(square) {
        this.updatePossibleMoves();

        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.game_pieces, square.i, square.j);
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

        if (this.activePiece.hasMoreJumps()) {
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
        return move;
    }
}

function WeirdCheckersStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    CheckersStateMachine.call(this,game_pieces, player1, player2, pieceNamespace, myPlayer);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.myPlayer.indexOf(game_piece.player) == -1) return false;
        if (this.isTurnStrict(game_piece.player)) return true;
        if (game_piece === this.forcedPiece) return true;
        if (this.isTurn(game_piece.player) && game_piece.color != this.forcedPiece.color) return true;
        return false;
    }

    this.next = function(square) {
        this.updatePossibleMoves();

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
        return move;
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
WeirdCheckersStateMachine.prototype.makeMove = function(from, to) {
    this.updatePossibleMoves();
    var piece = getGamePiece(this.game_pieces, from.i, from.j);
    var isJump = piece.isValidJump(to.i, to.j);

    this.move(piece, to);

    if (isJump && piece.hasMoreJumps()) {
        this.whoseTurn = 'both';
        this.forcedPiece = piece;
        drawing.drawBoard();
        drawing.drawPieces(this.game_pieces);
    } else {
        this.toggleTurn();
        this.forcedPiece = null;
        this.deactivate(piece);
    }
};



NormalCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
NormalCheckersStateMachine.prototype.makeMove = function(from, to) {
    this.updatePossibleMoves();
    var piece = getGamePiece(this.game_pieces, from.i, from.j);
    var isJump = piece.isValidJump(to.i, to.j);

    this.move(piece, to);

    if (isJump && piece.hasMoreJumps()) {
        this.forcedPiece = piece;
        drawing.drawBoard();
        drawing.drawPieces(this.game_pieces);
    } else {
        this.toggleTurn();
        this.forcedPiece = null;
        this.deactivate(piece);
    }
};