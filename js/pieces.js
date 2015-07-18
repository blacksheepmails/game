var PieceNamespace = function(game_pieces){

    CheckersKingPiece = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);
        this.possibleMoves = function() {
            var getPiece = getGamePiece.bind(this, game_pieces);
            var moves = [];

            for (var i_dir = -1; i_dir <= 1; i_dir += 2) {
                for (var j_dir = -1; j_dir <= 1; j_dir += 2) {

                    var piece = getPiece(this.i + i_dir, this.j + j_dir);
                    
                    if (piece == null) {
                        moves.push({
                            i: this.i + i_dir, 
                            j: this.j + j_dir, 
                            sideEffects: []
                        });
                    } else if (piece.color != color) {
                        if (getPiece(this.i + 2 * i_dir, this.j + 2 * j_dir) == null) {
                            moves.push({
                                i: this.i + 2 * i_dir, 
                                j: this.j + 2 * j_dir, 
                                sideEffects: [new Capture(piece)]
                            });
                        }
                    }
                }
            }
            return moves;
        }
    }

    CheckersPiece = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var getPiece = getGamePiece.bind(this, game_pieces);

            var moves = [];
            var j_dir = (color == 'black')? -1: 1;

            for (var i_dir = -1; i_dir <= 1; i_dir += 2) {
                var piece = getPiece(this.i + i_dir, this.j + 1 * j_dir);

                if (piece == null) {
                    moves.push({
                        i: this.i + i_dir, 
                        j: this.j + 1 * j_dir, 
                        sideEffects: []
                    });
                } else if (piece.color != color) {
                    if (getPiece(this.i + 2 * i_dir, this.j + 2 * j_dir) == null) {
                        moves.push({
                            i: this.i + 2 * i_dir, 
                            j: this.j + 2 * j_dir, 
                            sideEffects: [new Capture(piece)]
                        });
                    }
                }
            }

            moves = moves.filter(function(a) {
                return (a.i>=1 && a.i<=8 && a.j>=1 && a.j<=8 )? true: false;
            });
            for (var c = 0; c < moves.length; c++) {
                if (this.isLastRow(moves[c].j)) {
                    moves[c].sideEffects.push(new KingMe(this, moves[c]));
                }
            }

            return moves;
        };

        this.isLastRow = function(j) {
            if (color == 'black' && j == 1 || color == 'red' && j == 8) {
                return true;
            }
            return false;
        };
    }

    GamePiece = function(ctx, i, j, piece, color) {
        this.ctx = ctx
        this.i = i;
        this.j = j;
        this.piece = piece;
        this.color = color;
    };

    GamePiece.prototype = {
        isActive: false,
        possibleMoves: function() {
            return null;
        },
        isValidMove: function(i, j) {
            var validMoves = this.possibleMoves();

            for (var c = 0; c < validMoves.length; c++) {
                if (validMoves[c].i == i && validMoves[c].j == j) {
                    console.log(i.toString() + ', ' + j.toString() + ' is a valid move');
                    return true;
                }
            }
            return false;
        },
        getMove: function(i, j) {
            //should save possible moves instead of clculating them each time. anyways make this better later.
            var validMoves = this.possibleMoves();

            for (var c = 0; c < validMoves.length; c++) {
                if (validMoves[c].i == i && validMoves[c].j == j) {
                    return validMoves[c];
                }
            }
        },

        highlight: function(){
            this.ctx.lineWidth = "5";
            this.ctx.strokeStyle = "yellow";
            this.ctx.strokeRect(this.i * square_size, this.j * square_size, square_size, square_size);
        },
        draw : function() {
            if (this.isActive) {
                this.highlight();
            }

            this.ctx.drawImage(this.piece, this.i * square_size, this.j * square_size, square_size, square_size);
        }
    }

    CheckersKingPiece.prototype = Object.create(GamePiece.prototype);
    CheckersPiece.prototype = Object.create(GamePiece.prototype);

    function SideEffect() {}

    function Capture(piece) {
        this.go = function() {
            game_pieces.splice(game_pieces.indexOf(piece), 1);
        }
    }

    function KingMe(piece, move) {
        this.go = function() {
            var checkerImg = (piece.color == 'black') ? blackCheckerKing : redCheckerKing;
            game_pieces.splice(game_pieces.indexOf(piece), 1, new CheckersKingPiece(piece.ctx, move.i, move.j, checkerImg, piece.color));
        }
    }

    SideEffect.prototype = {
        go: function(){
            return;
        }
    }
    Capture.prototype = Object.create(SideEffect.prototype);
    KingMe.prototype = Object.create(SideEffect.prototype);

    return {
        CheckersKingPiece: CheckersKingPiece,
        CheckersPiece: CheckersPiece,
        GamePiece: GamePiece,
        Capture: Capture,
        KingMe: KingMe,
        SideEffect: SideEffect
    };
};
