function Player(color, game_pieces, pieceNamespace) {
    this.color = color;
    this.game_pieces = game_pieces;
    this.pieceNamespace = pieceNamespace;
}

function ChessPlayer(color, game_pieces, pieceNamespace) {
    Player.call(this, color, game_pieces, pieceNamespace);
    this.firstRow = (this.color == 'black')? 8 : 1;
    this.lastRow = (this.color == 'black')? 1 : 8;
    this.canCastleSquare2 = true;
    this.canCastleSquare6 = true;
    this.king = null;
}

function CheckersPlayer(color, game_pieces, pieceNamespace) {
    Player.call(this, color, game_pieces, pieceNamespace);
}

Player.prototype = {
    getMyPieces: function() {
        var equals = function(a) {return a.player === this};
        return this.game_pieces.filter(equals.bind(this));
    },
    getOpponentPieces: function() {
        var unequals = function(a) {return a.player !== this};
        return this.game_pieces.filter(unequals.bind(this));
    }
}

CheckersPlayer.prototype = Object.create(Player.prototype);
CheckersPlayer.prototype.canJump = function() {
    var myPieces = this.getMyPieces();
    for (var c = 0; c < myPieces.length; c++) {
        if (myPieces[c].hasMoreJumps()) return true;
    }
    return false;
}



ChessPlayer.prototype = Object.create(Player.prototype);
ChessPlayer.prototype.setKing = function() {
    var isKing = function(a) {return (a instanceof this.pieceNamespace.ChessKing && a.color === this.color)};
    this.king = this.game_pieces[
                    this.game_pieces.map(isKing.bind(this))
                        .indexOf(true)];
}
ChessPlayer.prototype.getEnemyMoves = function() {
    return this.getOpponentPieces().map(
                        function(a) {
                            return a.possibleMoves;
                        }).reduce(function(a,b) {
                            return a.concat(b);
                        });
}
ChessPlayer.prototype.getEnemyAttacks = function() {
    return this.getOpponentPieces().map(
                        function(a) {
                            return a.attacks;
                        }).reduce(function(a,b) {
                            return a.concat(b);
                        });
}
ChessPlayer.prototype.isInCheck = function() {
    var enemyMoves = this.getEnemyMoves();
    for (var c = 0; c < enemyMoves.length; c++) {
        var sideEffects = enemyMoves[c].sideEffects;
        for (var d = 0; d < sideEffects.length; d++) {
            if (sideEffects[d] instanceof this.pieceNamespace.Capture && sideEffects[d].captured === this.king) return true;
        }
    }
    return false;
}
ChessPlayer.prototype.isAttacked = function(squares) {
    var attacks = this.getEnemyAttacks();

    for (var c = 0; c < attacks.length; c++) {
        for (var d = 0; d < squares.length; d ++) {
            if (squares[d].i == attacks[c].i && squares[d].j == attacks[c].j) {

                return true;
            }
        }
    }
    return false;
}
ChessPlayer.prototype.canMove = function() {
    var myPieces = this.getMyPieces();
    for (var c = 0; c < myPieces.length; c++) {
        
    }
}
ChessPlayer.prototype.updateCanCastle = function(activePiece) {
    if (activePiece === this.king) {
        this.canCastleSquare2 = false;
        this.canCastleSquare6 = false;
    } else if (activePiece instanceof this.pieceNamespace.ChessRook) {
        if (activePiece.i == 1 && activePiece.j == this.firstRow) this.canCastleSquare2 = false;
        if (activePiece.i == 8 && activePiece.j == this.firstRow) this.canCastleSquare6 = false;
    }
}
ChessPlayer.prototype.addCastleMoves = function() {
    if (this.isInCheck()) return;
        
    if (this.canCastleSquare2) {
        console.log('can castle 2');
        var rook = getGamePiece(this.game_pieces, 1, this.firstRow);
        var rookMove = (rook === null)? null : rook.getMove(3, this.firstRow);
        if (rookMove != null && rookMove.sideEffects.length == 0) {
            var middleSquares = [{i: 2, j: this.firstRow},
                                 {i: 3, j: this.firstRow}];
            if (!this.isAttacked(middleSquares)) {
                console.log('adding castle move2');
                console.log(this.color);
                this.king.possibleMoves.push({i: 2,
                                              j: this.firstRow,
                                              sideEffects: [ new this.pieceNamespace.Move(rook, 3, this.firstRow) ]});
                console.log(this.king.possibleMoves);
            }
        }
    }
    if (this.canCastleSquare6) {
        console.log('can castle 6');
        var rook = getGamePiece(this.game_pieces, 8, this.firstRow);
        var rookMove = (rook === null)? null : rook.getMove(5, this.firstRow);
        if (rookMove != null && rookMove.sideEffects.length == 0) {
            var middleSquares = [{i: 5, j: this.firstRow},
                                 {i: 6, j: this.firstRow},
                                 {i: 7, j: this.firstRow}];
            if (!this.isAttacked(middleSquares)) {
                console.log('adding castle move6');
                this.king.possibleMoves.push({i: 6,
                                              j: this.firstRow,
                                              sideEffects: [ new this.pieceNamespace.Move(rook, 5, this.firstRow) ]});
            }
        }
    }
}
