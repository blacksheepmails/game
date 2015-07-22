
function GameStateMachine(game_pieces, player1, player2, pieceNamespace, myPlayer) {
    this.game_pieces = game_pieces;
    this.pieceNamespace = pieceNamespace;
    this.player1 = player1;
    this.player2 = player2;
    this.whoseTurn = player1;
    this.activePiece = null;
    this.myPlayer = myPlayer;
}

GameStateMachine.prototype = {
    deactivate: function(game_piece) {
        if (typeof game_piece === "undefined") game_piece = this.activePiece;   
        game_piece.isActive = false;
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
        if (player instanceof Player) {
            return (this.whoseTurn === player || this.whoseTurn === 'both');
        } else {
            for (var c=0; c<player.length; c++) {
                if (this.isTurn(player[c])) return true;
            }
            return false;
        }
    },

    isTurnStrict: function(player) {
        if (player instanceof this.pieceNamespace.Player) {
            return (this.whoseTurn === player);
        } else {
            for (var c=0; c<player.length; c++) {
                if (this.isTurn(player[c])) return true;
            }
            return false;
        }
    },

    toggleTurn: function() {
        if (this.whoseTurn == 'both') {
            this.whoseTurn = (this.activePiece.color == this.player1.color)? this.player2 : this.player1;
        } else {
            this.whoseTurn = (this.whoseTurn === this.player1)? this.player2 : this.player1;
        }
    },
    shouldActivate: function(game_piece) {
        return (game_piece != null && this.isTurn(game_piece.player) && this.isTurn(this.myPlayer));
    },
    isGameOver: function() {
        return false;
    },
    getPieces: function(player) {
        return this.game_pieces.filter(function(a) {return a.player === player;})
    },
    updatePossibleMoves: function() {
        for (var c = 0; c < this.game_pieces.length; c++) {
            this.game_pieces[c].calcPossibleMoves();
        }
    },
    move: function(piece, square) {
        piece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
        piece.i = square.i;
        piece.j = square.j;
    },
    makeMove: function(from, to) {
        this.updatePossibleMoves();
        var piece = getGamePiece(this.game_pieces, from.i, from.j);
        this.move(piece, to);
        this.toggleTurn();
        this.deactivate(piece);
    },
    makeMoveObject: function(square) {
        return {from: {i: this.activePiece.i, j: this.activePiece.j}, 
                to: square,
                color: this.activePiece.color};
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
        var move = null;
        this.updatePossibleMoves();
        var isValidMove = this.activePiece.isValidMove(square.i, square.j);
        
        if (isValidMove){
            move = this.makeMoveObject(square);
            this.move(this.activePiece, square);
            this.toggleTurn();
            this.deactivate();
        } 

        if (this.isGameOver()){
            console.log("Game over!");
        }
        return move;
    }
}

