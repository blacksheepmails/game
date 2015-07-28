
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

    var game_pieces = [];
    var captured_pieces = [];
    var player1 = new CheckersPlayer('red', game_pieces);
    var player2 = new CheckersPlayer('black', game_pieces)
    var pieceNamespace = PieceNamespace(game_pieces, captured_pieces, drawing);

    var RedChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, player1);
    };
    var BlackChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, player2);
    };

    if (typeof simple === "undefined" || simple === null || !simple){
        setupCheckersPieces(game_pieces, RedChecker, BlackChecker);
    } else {
        setupSimpleCheckersPieces(game_pieces, RedChecker, BlackChecker);
    }

    drawing.drawPieces(game_pieces);

    return {
        captured_pieces: captured_pieces,
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}

function initChess(ctx, simple) {

    var game_pieces = [];
    var captured_pieces = [];
    var pieceNamespace = PieceNamespace(game_pieces, captured_pieces, drawing);
    var player1 = new ChessPlayer('white', game_pieces, pieceNamespace);
    var player2 = new ChessPlayer('black', game_pieces, pieceNamespace);

    if (typeof simple === "undefined" || !simple) {

        for (var i = 1; i <= 8; i ++) {
            game_pieces.push(new pieceNamespace.ChessPawn(ctx, i, 2, player1));
            game_pieces.push(new pieceNamespace.ChessPawn(ctx, i, 7, player2));
        }
        for (var i = 1; i <= 8; i += 7) {
            game_pieces.push(new pieceNamespace.ChessRook(ctx, i, 1, player1));
            game_pieces.push(new pieceNamespace.ChessRook(ctx, i, 8, player2));
        }
        for (var i = 2; i <= 7; i+= 5) {
            game_pieces.push(new pieceNamespace.ChessKnight(ctx, i, 1, player1));
            game_pieces.push(new pieceNamespace.ChessKnight(ctx, i, 8, player2));
        }
        for (var i = 3; i <= 6; i+= 3) {
            game_pieces.push(new pieceNamespace.ChessBishop(ctx, i, 1, player1));
            game_pieces.push(new pieceNamespace.ChessBishop(ctx, i, 8, player2));
        }
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, player1));
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 8, player2));

        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, player1));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, player2));

    } else {
        game_pieces.push(new pieceNamespace.ChessRook(ctx, 1, 1, player1));
        game_pieces.push(new pieceNamespace.ChessRook(ctx, 1, 8, player2));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 1, player1));
        game_pieces.push(new pieceNamespace.ChessKing(ctx, 4, 8, player2));
        game_pieces.push(new pieceNamespace.ChessQueen(ctx, 5, 1, player1));
        game_pieces.push(new pieceNamespace.ChessPawn(ctx, 7, 7, player2));
    }

    player1.setKing();
    player2.setKing();

    drawing.drawPieces(game_pieces);


    return {
        captured_pieces: captured_pieces,
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}