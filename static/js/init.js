
var setupSimpleCheckersPieces = function(gamePieces, Red, Black){
    gamePieces.push(Red(3, 3));
    gamePieces.push(Red(4, 2));

    gamePieces.push(Black(5, 5));

    return gamePieces;
};

var setupCheckersPieces = function(gamePieces, Red, Black){
    for (var i = 2; i <= 8; i += 2) {
        gamePieces.push(Red(i - 1, 1));
        gamePieces.push(Red(i, 2));
        gamePieces.push(Red(i - 1, 3));

        gamePieces.push(Black(i, 6));
        gamePieces.push(Black(i - 1, 7));
        gamePieces.push(Black(i, 8));
    }

    return gamePieces;
};

function initCheckers(ctx, simple) {

    var gamePieces = [];
    var captured_pieces = [];
    var player1 = new CheckersPlayer('red', gamePieces);
    var player2 = new CheckersPlayer('black', gamePieces)
    var pieceNamespace = PieceNamespace(gamePieces, captured_pieces, drawing);

    var RedChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, player1);
    };
    var BlackChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, player2);
    };

    if (typeof simple === "undefined" || simple === null || !simple){
        setupCheckersPieces(gamePieces, RedChecker, BlackChecker);
    } else {
        setupSimpleCheckersPieces(gamePieces, RedChecker, BlackChecker);
    }

    drawing.drawPieces(gamePieces);

    return {
        captured_pieces: captured_pieces,
        gamePieces: gamePieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}

function initChess(ctx, simple) {

    var gamePieces = [];
    var captured_pieces = [];
    var pieceNamespace = PieceNamespace(gamePieces, captured_pieces, drawing);
    var player1 = new ChessPlayer('white', gamePieces, pieceNamespace);
    var player2 = new ChessPlayer('black', gamePieces, pieceNamespace);

    if (typeof simple === "undefined" || !simple) {

        for (var i = 1; i <= 8; i ++) {
            gamePieces.push(new pieceNamespace.ChessPawn(ctx, i, 2, player1));
            gamePieces.push(new pieceNamespace.ChessPawn(ctx, i, 7, player2));
        }
        for (var i = 1; i <= 8; i += 7) {
            gamePieces.push(new pieceNamespace.ChessRook(ctx, i, 1, player1));
            gamePieces.push(new pieceNamespace.ChessRook(ctx, i, 8, player2));
        }
        for (var i = 2; i <= 7; i+= 5) {
            gamePieces.push(new pieceNamespace.ChessKnight(ctx, i, 1, player1));
            gamePieces.push(new pieceNamespace.ChessKnight(ctx, i, 8, player2));
        }
        for (var i = 3; i <= 6; i+= 3) {
            gamePieces.push(new pieceNamespace.ChessBishop(ctx, i, 1, player1));
            gamePieces.push(new pieceNamespace.ChessBishop(ctx, i, 8, player2));
        }
        gamePieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, player1));
        gamePieces.push(new pieceNamespace.ChessQueen(ctx, 5, 8, player2));

        gamePieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, player1));
        gamePieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, player2));

    } else {
        gamePieces.push(new pieceNamespace.ChessRook(ctx, 1, 1, player1));
        gamePieces.push(new pieceNamespace.ChessRook(ctx, 1, 8, player2));
        gamePieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, player1));
        gamePieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, player2));
        gamePieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, player1));
        gamePieces.push(new pieceNamespace.ChessPawn(ctx, 7, 7, player2));
    }

    player1.setKing();
    player2.setKing();

    drawing.drawPieces(gamePieces);


    return {
        captured_pieces: captured_pieces,
        gamePieces: gamePieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}