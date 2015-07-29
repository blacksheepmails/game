var PieceNamespace = function(gamePieces, capturedPieces, drawing){

    CheckersKingPiece = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackCheckerKing : img.redCheckerKing;
        GamePiece.call(this, ctx, i, j, image, player);
        
        this.calcPossibleMoves = function() {
            var getPiece = getGamePiece.bind(this, gamePieces);
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
                    } else if (piece.player != this.player) {
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
            this.possibleMoves = moves;
            return moves;
        }
    }

    CheckersPiece = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackChecker : img.redChecker;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var getPiece = getGamePiece.bind(this, gamePieces);

            var moves = [];
            var j_dir = (this.color == 'black')? -1: 1;

            for (var i_dir = -1; i_dir <= 1; i_dir += 2) {
                var piece = getPiece(this.i + i_dir, this.j + 1 * j_dir);

                if (piece == null) {
                    moves.push({
                        i: this.i + i_dir, 
                        j: this.j + 1 * j_dir, 
                        sideEffects: []
                    });
                } else if (piece.player != this.player) {
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
            this.possibleMoves = moves;
            return moves;
        };
    }

    ChessPawn = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackPawn : img.whitePawn;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var getPiece = getGamePiece.bind(this, gamePieces);
            var moves = [];
            var attacks = [];
            var j_dir = (this.color == 'black')? -1: 1;

            var piece = getPiece(this.i, this.j + j_dir);
            if (piece == null) {
                moves.push({
                    i: this.i, 
                    j: this.j + 1 * j_dir, 
                    sideEffects: []
                });
                if (this.j == 2 && this.color == 'white' || this.j == 7 && this.color == 'black') {
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
                if (piece != null && piece.player != this.player) {
                    var move = {i: this.i + i_dir,
                                j: this.j + 1 * j_dir,
                                sideEffects: [new Capture(piece)]};
                    moves.push(move);
                    attacks.push(move);
                } else if (piece == null) {
                    attacks.push({i: this.i + i_dir,
                                  j: this.j + 1 * j_dir,
                                  sideEffects: []});
                }
            }

            moves = this.makeInRange(moves);
            for (var c = 0; c < moves.length; c++) {
                if (this.isLastRow(moves[c].j)) {
                    moves[c].sideEffects.push(new EvolvePawn(this, moves[c]));
                }
            }
            this.possibleMoves = moves;
            this.attacks = attacks;
            return moves;
        }
    }

    ChessRook = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackRook : img.whiteRook;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var moves = [];
            var directions = [{i: 1, j: 0},
                              {i: -1, j: 0},
                              {i: 0, j: 1},
                              {i: 0, j: -1}];
            for (var c = 0; c < directions.length; c++) {
                this.extend(moves, directions[c]);
            }
            this.possibleMoves = moves;
            this.attacks = moves;
            return moves;
        }
    }

    ChessKnight = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackKnight : img.whiteKnight;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var getPiece = getGamePiece.bind(this, gamePieces);
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
                } else if (piece.player != this.player) {
                    moves.push({
                        i: this.i + jump.i,
                        j: this.j + jump.j,
                        sideEffects: [new Capture(piece)]
                    });
                }
            }
            moves = this.makeInRange(moves);
            this.possibleMoves = moves;
            this.attacks = moves;
            return moves;
        }
    }

    ChessBishop = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackBishop : img.whiteBishop;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var moves = [];
            var directions = [{i: 1, j: 1},
                              {i: -1, j: 1},
                              {i: 1, j: -1},
                              {i: -1, j: -1}];
            for (var c = 0; c < directions.length; c++) {
                this.extend(moves, directions[c]);
            }
            this.possibleMoves = moves;
            this.attacks = moves;
            return moves;
        }
    }

    ChessQueen = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackQueen : img.whiteQueen;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
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
            this.attacks = moves;
            this.possibleMoves = moves;
            return moves;
        }
    }
    
    ChessKing = function(ctx, i, j, player) {
        var image = (player.color == 'black') ? img.blackKing : img.whiteKing;
        GamePiece.call(this, ctx, i, j, image, player);

        this.calcPossibleMoves = function() {
            var getPiece = getGamePiece.bind(this, gamePieces);
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
                    } else if (piece.player != this.player) {
                        moves.push({
                            i: this.i + i_dir,
                            j: this.j + j_dir,
                            sideEffects: [new Capture(piece)]
                        });
                    }
                }
            }
            moves = this.makeInRange(moves);
            this.attacks = moves;
            this.possibleMoves = moves;
            return moves;
        }
    }
    
    GamePiece = function(ctx, i, j, img, player) {
        this.ctx = ctx
        this.i = i;
        this.j = j;
        this.img = img;
        this.player = player
        this.color = player.color;
        this.possibleMoves = [];
        // this.attacks = []; put only in ChessPiece which doesnt yet exist.
    };

    GamePiece.prototype = {
        isActive: false,
        calcPossibleMoves: function() {
            return [];
        },
        hasJumps: function() {
            var moves = this.possibleMoves;
            for (var c = 0; c < moves.length; c++) {
                for (var d = 0; d < moves[c].sideEffects.length; d ++) {
                    if (moves[c].sideEffects[d] instanceof Capture) {
                        return true;
                    }
                } 
            }
            return false;
        },
        isValidJump : function(i, j) {
            var moves = this.possibleMoves;
            for (var c = 0; c < moves.length; c++) {
                if (moves[c].i == i && moves[c].j == j) {
                    for (var d = 0; d < moves[c].sideEffects.length; d ++) {
                        if (moves[c].sideEffects[d] instanceof Capture) {
                            console.log(i.toString() + ', ' + j.toString() + ' is a valid jump');

                            return true;
                        }
                    }
                } 
            }
            return false;
        },
        isValidMove: function(i, j) {
            var moves = this.possibleMoves;

            for (var c = 0; c < moves.length; c++) {
                if (moves[c].i == i && moves[c].j == j) {
                    console.log(i.toString() + ', ' + j.toString() + ' is a valid move');
                    return true;
                }
            }
            return false;
        },
        extend: function(moves, inc) {
            var getPiece = getGamePiece.bind(this, gamePieces);
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
                    if (piece.player != this.player) {
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
            if (this.color == 'black' && j == 1 || this.color != 'black' && j == 8) {
                return true;
            }
            return false;
        },
        getMove: function(i, j) {
            var moves = this.possibleMoves;

            for (var c = 0; c < moves.length; c++) {
                if (moves[c].i == i && moves[c].j == j) {
                    return moves[c];
                }
            }
        },
        draw : function() {
            drawing.drawPiece(this);
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
        this.captured = piece;
        this.go = function() {
            gamePieces.splice(gamePieces.indexOf(piece), 1);
            capturedPieces.push(piece);

        }
        this.inverse = function() {
            capturedPieces.splice(capturedPieces.indexOf(piece), 1);
            gamePieces.push(piece);
        }
    }
    function Move(piece, i, j) {
        var old_i = piece.i;
        var old_j = piece.j;
        this.moved = piece;
        this.go = function() {
            piece.i = i;
            piece.j = j;
        }
        this.inverse = function() {
            piece.i = old_i;
            piece.j = old_j;
        }
    }

    function KingMe(piece, move) {
        var checkerImg = (piece.color == 'black') ? img.blackCheckerKing : img.redCheckerKing;
        this.king = new CheckersKingPiece(piece.ctx, move.i, move.j, checkerImg, piece.player);
        this.go = function() {
            gamePieces.splice(gamePieces.indexOf(piece), 1, this.king);
        }
        this.inverse = function() {
            gamePieces.splice(gamePieces.indexOf(this.king), 1, piece);
        }
    }

    function EvolvePawn(piece, move) {
        this.evolved = null;
        var box = document.getElementById("choices");

        function getEvolvedPiece(choice) {
            var pieceClass = null;
            if (choice === 'queen')
                pieceClass = ChessQueen;
            else if (choice === 'rook')
                pieceClass = ChessRook;
            else if (choice === 'bishop')
                pieceClass = ChessBishop;
            else if (choice === 'knight')
                pieceClass = ChessKnight;
            return new pieceClass(piece.ctx, move.i, move.j, piece.player);
        }
        function submit() {
            var choices = document.getElementsByName('evolved');
            for (var c = 0; c < choices.length; c++) {
                if (choices[c].checked) {
                    var choice = choices[c].value;
                    socket.emit('picked_piece', choice);
                    this.evolved = getEvolvedPiece(choice);
                    break;
                }
            }
            gamePieces.splice(gamePieces.indexOf(piece), 1, this.evolved);
            box.style.visibility = 'hidden';
            drawing.drawBoard();
            drawing.drawPieces(gamePieces);
        }
        this.go = function(msg) {
            if (typeof msg !== 'undefined') {
                if (msg == 'from makeMove') msg = 'queen'
                this.evolved = getEvolvedPiece(msg);
            }
            if (this.evolved === null) {
                document.getElementById("evolve-submit").addEventListener("click", submit.bind(this));
                box.style.visibility = 'visible';
                socket.emit('picking_piece', '');
            } else gamePieces.splice(gamePieces.indexOf(piece), 1, this.evolved);

        }
        this.inverse = function() {
            gamePieces.splice(gamePieces.indexOf(this.evolved), 1, piece);
        }
    }

    SideEffect.prototype = {
        go: function(){
            return;
        },
        inverse: function(){
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
        Move: Move,
        EvolvePawn: EvolvePawn,
        SideEffect: SideEffect
    };
};
