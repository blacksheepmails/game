
function GameStateMachine(game_pieces, pieceNamespace) {
    this.game_pieces = game_pieces;
    this.pieceNamespace = pieceNamespace
    this.whoseTurn = 'red';
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

    isTurn: function(color) {
        return (this.whoseTurn === color || this.whoseTurn === 'both');
    },

    isTurnStrict: function(color) {
        return this.whoseTurn === color;
    },

    toggleTurn: function(color) {
        if (color == 'both') {
            return this.toggleTurn(this.activePiece.color);
        } else {
            return (color == 'red')? 'black' : 'red';
        }
    },
    shouldActivate: function(game_piece) {
        return !(game_piece == null || !this.isTurnStrict(game_piece.color));
    },
    isGameOver: function() {
        return false;
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
            this.whoseTurn = this.toggleTurn(this.whoseTurn);
            this.deactivate();
        } 

        if (this.isGameOver()){
            console.log("Game over!");
        }
    }
}

