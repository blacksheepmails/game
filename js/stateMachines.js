
function GameStateMachine(game_pieces, player1, player2, pieceNamespace) {
    this.game_pieces = game_pieces;
    this.pieceNamespace = pieceNamespace;
    this.player1 = player1;
    this.player2 = player2;
    this.whoseTurn = player1;
    this.activePiece = null;
}

GameStateMachine.prototype = {
    deactivate: function() {
        this.activePiece.isActive = false;
        drawing.drawBoard();
        drawing.drawPieces(this.game_pieces);
        this.activePiece = null;  
    },
    
    activate: function(game_piece) {
        game_piece.isActive = true;
        this.activePiece = game_piece;
        game_piece.draw();
    },

    isTurn: function(player) {
        return (this.whoseTurn === player || this.whoseTurn === 'both');
    },

    isTurnStrict: function(player) {
        return (this.whoseTurn === player);
    },

    toggleTurn: function() {
        if (this.whoseTurn == 'both') {
            this.whoseTurn = (this.activePiece.color == this.player1.color)? this.player2 : this.player1;
        } else {
            this.whoseTurn = (this.whoseTurn === this.player1)? this.player2 : this.player1;
        }
    },
    shouldActivate: function(game_piece) {
        return (game_piece != null && this.isTurnStrict(game_piece.player));
    },
    isGameOver: function() {
        return false;
    },
    getPieces: function(player) {
        return this.game_pieces.filter(function(a) {return a.player === player;})
    },
    next: function(square) {
        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.game_pieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.activePiece.i == square.i && this.activePiece.j == square.j) {
            this.deactivate();
            return;
        }
        var isValidMove = this.activePiece.isValidMove(square.i, square.j);
        
        if (isValidMove){
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

