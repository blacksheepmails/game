function Player(color, game_pieces) {
    this.color = color;
    this.game_pieces = game_pieces
}

function ChessPlayer(color, game_pieces) {
    Player.call(this, color, game_pieces);
    this.canCastle = true;
}

function CheckersPlayer(color, game_pieces) {
    Player.call(this, color, game_pieces);
}

Player.prototype = {
    getMyPieces: function() {
        return this.game_pieces.filter(function(a) {return a.player === this;})
    },
    getOpponentPieces: function() {
        return this.game_pieces.filter(function(a) {return a.player !== this;})
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
ChessPlayer.prototype.isInCheck = function() {
    var enemyPieces = getOpponentPieces();
    for (var c = 0; c < enemyPieces.length; c++) {
        sideEffects = enemyPieces[c].sideEffects;
        for (var d = 0; d < sideEffects.length; d++) {
            if (sideEffects[d] instanceof pieceNamespace.Capture && sideEffects[d].captured instanceof pieceNamespace.ChessKing) return true;
        }
    }
    return false;
}
