
function CheckersStateMachine (game_pieces, pieceNamespace) {
    this.game_pieces = game_pieces;
    this.pieceNamespace = pieceNamespace
    this.whoseTurn = 'red';
    this.activePiece = null;
    this.forcedPiece = null;
    this.lastMove = null;
}

function WeirdCheckersStateMachine (game_pieces, piecesNamespace) {
    CheckersStateMachine.call(this,game_pieces, piecesNamespace);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurnStrict(game_piece.color)) return true;
        if (game_piece === this.forcedPiece) return true;
        if (this.isTurn(game_piece.color) && game_piece.color != this.forcedPiece.color) return true;
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
            isJump = this.isValidJump(this.activePiece, square.i, square.j);
            isValidMove = isJump;
        } else {
            isValidMove = this.activePiece.isValidMove(square.i, square.j);
            isJump = this.isValidJump(this.activePiece, square.i, square.j);
        }
        if (isValidMove){
            this.activePiece.getMove(square.i, square.j).sideEffects.map(function(x) {x.go();});
            this.activePiece.i = square.i;
            this.activePiece.j = square.j;
            if (isJump && this.hasMoreJumps(this.activePiece)) {
                this.whoseTurn = 'both';
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.game_pieces);
            } else {
                this.whoseTurn = this.toggleTurn(this.whoseTurn);
                this.forcedPiece = null;
                this.deactivate();
            }
        } 
    }
}

function NormalCheckersStateMachine (game_pieces, piecesNamespace) {
    CheckersStateMachine.call(this, game_pieces, piecesNamespace);

    this.shouldActivate = function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurnStrict(game_piece.color)) {
            var canJump = false;
            var myPieces = game_pieces.filter(function(a) {return (a.color == game_piece.color)? true: false;});
            for (var c = 0; c < myPieces.length; c++) {
                if (this.hasMoreJumps(myPieces[c])) canJump = true;
            }
            if (canJump) {
                return (this.hasMoreJumps(game_piece))? true: false;
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
        if (this.hasMoreJumps(this.activePiece)) {
            if (this.isValidJump(this.activePiece, square.i, square.j)) {
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
            if (isJump && this.hasMoreJumps(this.activePiece)) {
                this.forcedPiece = this.activePiece;
                drawing.drawBoard();
                drawing.drawPieces(this.game_pieces);
            } else {
                this.whoseTurn = this.toggleTurn(this.whoseTurn);
                this.forcedPiece = null;
                this.deactivate();
            }
        } 
        
        if (this.isGameOver()){
            console.log("Game over!");
        }
    }
}


CheckersStateMachine.prototype = {
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
        return (this.whoseTurn === color || this.whoseTurn === 'both')? true: false;
    },

    isTurnStrict: function(color) {
        return (this.whoseTurn === color)? true: false;
    },

    isGameOver: function() {
        if (this.game_pieces.length < 2) { return true; }

        var colour = this.game_pieces[0].color;

        for (var i = 0; i < this.game_pieces.length; i++){
            if (this.game_pieces[i].color !== colour){ 
                return false;
            }
        }

        return true;
    },

    hasMoreJumps: function(piece) {
        var moves = piece.possibleMoves();
        for (var c = 0; c < moves.length; c++) {
            for (var d = 0; d < moves[c].sideEffects.length; d ++) {
                if (moves[c].sideEffects[d] instanceof this.pieceNamespace.Capture) {
                    console.log(moves[c]);
                    return true;
                }
            } 
        }
        return false;
    },

    isValidJump: function(piece, i, j) {
        var moves = piece.possibleMoves();
        for (var c = 0; c < moves.length; c++) {
            if (moves[c].i == i && moves[c].j == j) {
                for (var d = 0; d < moves[c].sideEffects.length; d ++) {
                    if (moves[c].sideEffects[d] instanceof this.pieceNamespace.Capture) {
                        console.log(moves[c]);
                        return true;
                    }
                }
            } 
        }
    },

    toggleTurn: function(color) {
        if (color == 'both') {
            return this.toggleTurn(this.activePiece.color);
        } else {
            return (color == 'red')? 'black' : 'red';
        }
    },
    shouldActivate: function(game_piece) {
        if (game_piece == null) return false;
        if (this.isTurnStrict(game_piece.color)) return true;
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
    }
}

WeirdCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
NormalCheckersStateMachine.prototype = Object.create(CheckersStateMachine.prototype);
