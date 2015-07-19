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

            moves = this.makeInRange(moves);
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

            moves = this.makeInRange(moves);
            for (var c = 0; c < moves.length; c++) {
                if (this.isLastRow(moves[c].j)) {
                    moves[c].sideEffects.push(new KingMe(this, moves[c]));
                }
            }

            return moves;
        };
    }

    ChessPawn = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var getPiece = getGamePiece.bind(this, game_pieces);
            var moves = [];
            var j_dir = (color == 'black')? -1: 1;

            var piece = getPiece(this.i, this.j + j_dir);
            if (piece == null) {
                moves.push({
                    i: this.i, 
                    j: this.j + 1 * j_dir, 
                    sideEffects: []
                });
                if (this.j == 2 && this.color == 'red' || this.j == 7 && this.color == 'black') {
                    piece = getPiece(this.i, this.j + 2*j_dir);
                    if (piece == null) {
                        moves.push({
                            i: this.i, 
                            j: this.j + 2 * j_dir, 
                            sideEffects: []
                        });
                    }
                }
            }

            for (var i_dir = -1; i_dir <= 1; i_dir+=2) {
                piece = getPiece(this.i + i_dir, this.j + j_dir);
                if (piece != null && piece.color != this.color) {
                    moves.push({
                        i: this.i + i_dir,
                        j: this.j + 1 * j_dir,
                        sideEffects: [new Capture(piece)]
                    });
                }
            }

            moves = this.makeInRange(moves);
            for (var c = 0; c < moves.length; c++) {
                if (this.isLastRow(moves[c].j)) {
                    moves[c].sideEffects.push(new EvolvePawn(this, moves[c]));
                }
            }
            return moves;
        }
    }

    ChessRook = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var moves = [];
            var directions = [{i: 1, j: 0},
                              {i: -1, j: 0},
                              {i: 0, j: 1},
                              {i: 0, j: -1}];
            for (var c = 0; c < directions.length; c++) {
                this.extend(moves, directions[c]);
            }

            return moves;
        }
    }

    ChessKnight = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var getPiece = getGamePiece.bind(this, game_pieces);
            var moves = [];
            var jumps = [{i: -2, j: -1},
                         {i: -2, j: 1},
                         {i: -1, j: -2},
                         {i: -1, j: 2},
                         {i: 1, j: -2},
                         {i: 1, j: 2},
                         {i: 2, j: -1},
                         {i: 2, j: 1}];
            for (var c = 0; c < jumps.length; c++) {
                jump = jumps[c];
                var piece = getPiece(this.i + jump.i, this.j + jump.j);
                if (piece === null) {
                    moves.push({
                        i: this.i + jump.i,
                        j: this.j + jump.j,
                        sideEffects: []
                    });
                } else if (piece.color != this.color) {
                    moves.push({
                        i: this.i + jump.i,
                        j: this.j + jump.j,
                        sideEffects: [new Capture(piece)]
                    });
                }
            }
            moves = this.makeInRange(moves);
            return moves;
        }
    }

    ChessBishop = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var moves = [];
            var directions = [{i: 1, j: 1},
                              {i: -1, j: 1},
                              {i: 1, j: -1},
                              {i: -1, j: -1}];
            for (var c = 0; c < directions.length; c++) {
                this.extend(moves, directions[c]);
            }

            return moves;
        }
    }

    ChessQueen = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var moves = [];
            var directions = [{i: 1, j: 0},
                              {i: -1, j: 0},
                              {i: 0, j: 1},
                              {i: 0, j: -1},
                              {i: 1, j: 1},
                              {i: -1, j: 1},
                              {i: 1, j: -1},
                              {i: -1, j: -1}];
            for (var c = 0; c < directions.length; c++) {
                this.extend(moves, directions[c]);
            }

            return moves;
        }
    }
    
    ChessKing = function(ctx, i, j, piece, color) {
        GamePiece.call(this, ctx, i, j, piece, color);

        this.possibleMoves = function() {
            var getPiece = getGamePiece.bind(this, game_pieces);
            var moves = [];
            for (i_dir = -1; i_dir <= 1; i_dir +=1) {
                for (j_dir = -1; j_dir <= 1; j_dir +=1) {
                    var piece = getPiece(this.i + i_dir, this.j + j_dir);
                    if (piece === null) {
                        moves.push({
                            i: this.i + i_dir,
                            j: this.j + j_dir,
                            sideEffects: []
                        });
                    } else if (piece.color != this.color) {
                        moves.push({
                            i: this.i + i_dir,
                            j: this.j + j_dir,
                            sideEffects: [new Capture(piece)]
                        });
                    }
                }
            }
            moves = this.makeInRange(moves);
            return moves;
        }
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
        extend: function(moves, inc) {
            var getPiece = getGamePiece.bind(this, game_pieces);
            var c = 1;
            while (this.inRange(this.i + c*inc.i, this.j + c*inc.j)) {
                var piece = getPiece(this.i + c*inc.i, this.j + c*inc.j);

                if (piece === null) {
                    moves.push({
                        i: this.i + c*inc.i,
                        j: this.j + c*inc.j,
                        sideEffects: []
                    });
                    c++;
                } else {
                    if (piece.color != this.color) {
                        moves.push({
                            i: this.i + c*inc.i,
                            j: this.j + c*inc.j,
                            sideEffects: [new Capture(piece)]
                        });
                    }
                    return;
                }
            }
        },
        inRange: function(i, j) {
            return i>=1 && i<=8 && j>=1 && j<=8;
        },
        makeInRange: function(moves) {
            return moves.filter(function(a) {
                return this.inRange(a.i, a.j);
            }.bind(this));
        },
        isLastRow: function(j) {
            if (this.color == 'black' && j == 1 || this.color == 'red' && j == 8) {
                return true;
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
    ChessPawn.prototype = Object.create(GamePiece.prototype);
    ChessRook.prototype = Object.create(GamePiece.prototype);
    ChessKnight.prototype = Object.create(GamePiece.prototype);
    ChessBishop.prototype = Object.create(GamePiece.prototype);
    ChessQueen.prototype = Object.create(GamePiece.prototype);
    ChessKing.prototype = Object.create(GamePiece.prototype);

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

    function EvolvePawn(piece, move) {
        this.go = function() {
            var queenImg = (piece.color == 'black') ? blackQueen : whiteQueen;
            game_pieces.splice(game_pieces.indexOf(piece), 1, new ChessQueen(piece.ctx, move.i, move.j, queenImg, piece.color));
        }
    }

    SideEffect.prototype = {
        go: function(){
            return;
        }
    }
    Capture.prototype = Object.create(SideEffect.prototype);
    KingMe.prototype = Object.create(SideEffect.prototype);
    EvolvePawn.prototype = Object.create(SideEffect.prototype);

    return {
        CheckersKingPiece: CheckersKingPiece,
        CheckersPiece: CheckersPiece,
        ChessPawn: ChessPawn,
        ChessRook: ChessRook,
        ChessKnight: ChessKnight,
        ChessBishop: ChessBishop,
        ChessQueen: ChessQueen,
        ChessKing: ChessKing,
        GamePiece: GamePiece,
        Capture: Capture,
        KingMe: KingMe,
        EvolvePawn: EvolvePawn,
        SideEffect: SideEffect
    };
};
