
var setupSimpleCheckersPieces = function(game_pieces, Red, Black){
    game_pieces.push(Red(3, 3));
    game_pieces.push(Red(4, 2));

    game_pieces.push(Black(5, 5));

    return game_pieces;
};

var setupCheckersPieces = function(game_pieces, Red, Black){
    for (var i = 2; i <= 8; i += 2) {
        game_pieces.push(Red(i - 1, 1));
        game_pieces.push(Red(i, 2));
        game_pieces.push(Red(i - 1, 3));

        game_pieces.push(Black(i, 6));
        game_pieces.push(Black(i - 1, 7));
        game_pieces.push(Black(i, 8));
    }

    return game_pieces;
};

function initCheckers(ctx, simple) {
    var redCheckerKing = document.getElementById('red-checker-king');
    var blackCheckerKing = document.getElementById('black-checker-king');
    var blackChecker = document.getElementById('black-checker');
    var redChecker = document.getElementById('red-checker');

    var game_pieces = [];
    var player1 = new CheckersPlayer('red', game_pieces);
    var player2 = new CheckersPlayer('black', game_pieces)
    var pieceNamespace = PieceNamespace(game_pieces);

    var RedChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, redChecker, player1);
    };
    var BlackChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, blackChecker, player2);
    };

    if (typeof simple === "undefined" || simple === null || !simple){
        setupCheckersPieces(game_pieces, RedChecker, BlackChecker);
    } else {
        setupSimpleCheckersPieces(game_pieces, RedChecker, BlackChecker);
    }

    drawing.drawPieces(game_pieces);

    return {
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}

function initChess(ctx, simple) {
    var blackPawn = document.getElementById('black-pawn');
    var whitePawn = document.getElementById('white-pawn');
    var blackKnight = document.getElementById('black-knight');
    var whiteKnight = document.getElementById('white-knight');
    var blackBishop = document.getElementById('black-bishop');
    var whiteBishop = document.getElementById('white-bishop');
    var blackRook = document.getElementById('black-rook');
    var whiteRook = document.getElementById('white-rook');
    var blackKing = document.getElementById('black-king');
    var whiteKing = document.getElementById('white-king');
    var blackQueen = document.getElementById('black-queen');
    var whiteQueen = document.getElementById('white-queen');

    var game_pieces = [];
    var pieceNamespace = PieceNamespace(game_pieces);
    var player1 = new ChessPlayer('white', game_pieces, pieceNamespace);
    var player2 = new ChessPlayer('black', game_pieces, pieceNamespace);

    if (typeof simple === "undefined" || !simple) {

        for (var i = 1; i <= 8; i ++) {
            game_pieces.push(new pieceNamespace.ChessPawn(ctx, i, 2, whitePawn, player1));
            game_pieces.push(new pieceNamespace.ChessPawn(ctx, i, 7, blackPawn, player2));
        }
        for (var i = 1; i <= 8; i += 7) {
            game_pieces.push(new pieceNamespace.ChessRook(ctx, i, 1, whiteRook, player1));
            game_pieces.push(new pieceNamespace.ChessRook(ctx, i, 8, blackRook, player2));
        }
        for (var i = 2; i <= 7; i+= 5) {
            game_pieces.push(new pieceNamespace.ChessKnight(ctx, i, 1, whiteKnight, player1));
            game_pieces.push(new pieceNamespace.ChessKnight(ctx, i, 8, blackKnight, player2));
        }
        for (var i = 3; i <= 6; i+= 3) {
            game_pieces.push(new pieceNamespace.ChessBishop(ctx, i, 1, whiteBishop, player1));
            game_pieces.push(new pieceNamespace.ChessBishop(ctx, i, 8, blackBishop, player2));
        }
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, whiteQueen, player1));
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 8, blackQueen, player2));

        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, whiteKing, player1));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, blackKing, player2));

    } else {
        game_pieces.push(new pieceNamespace.ChessRook(ctx, 1, 1, whiteRook, player1));
        game_pieces.push(new pieceNamespace.ChessRook(ctx, 1, 8, blackRook, player2));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, whiteKing, player1));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, blackKing, player2));
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, whiteQueen, player1));
        game_pieces.push(new pieceNamespace.ChessPawn(ctx, 7, 7, blackPawn, player2));
    }

    player1.setKing();
    player2.setKing();

    drawing.drawPieces(game_pieces);


    return {
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}