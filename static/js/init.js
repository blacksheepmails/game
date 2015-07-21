
var redCheckerKing = new Image();
redCheckerKing.src = "img/checkers/red_checker_king.png";
var blackCheckerKing = new Image();
blackCheckerKing.src = 'img/checkers/black_checker_king.png';

var blackPawn = new Image();
blackPawn.src = "img/chess/black_pawn.png";
var whitePawn = new Image();
whitePawn.src = 'img/chess/white_pawn.png';

var blackKnight = new Image();
blackKnight.src = "img/chess/black_knight.png";
var whiteKnight = new Image();
whiteKnight.src = 'img/chess/white_knight.png';

var blackBishop = new Image();
blackBishop.src = "img/chess/black_bishop.png";
var whiteBishop = new Image();
whiteBishop.src = 'img/chess/white_bishop.png';

var blackRook = new Image();
blackRook.src = "img/chess/black_rook.png";
var whiteRook = new Image();
whiteRook.src = 'img/chess/white_rook.png';

var blackKing = new Image();
blackKing.src = "img/chess/black_king.png";
var whiteKing = new Image();
whiteKing.src = 'img/chess/white_king.png';

var blackQueen = new Image();
blackQueen.src = "img/chess/black_queen.png";
var whiteQueen = new Image();
whiteQueen.src = 'img/chess/white_queen.png';


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
    var blackCheckerImg = new Image();
    blackCheckerImg.src = "img/checkers/black_checker.png";
    var redCheckerImg = new Image();
    redCheckerImg.src = 'img/checkers/red_checker.png';

    var game_pieces = [];
    var player1 = new CheckersPlayer('red', game_pieces);
    var player2 = new CheckersPlayer('black', game_pieces)
    var pieceNamespace = PieceNamespace(game_pieces);

    var RedChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, redCheckerImg, player1);
    };
    var BlackChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, blackCheckerImg, player2);
    };

    if (typeof simple === "undefined" || simple === null || !simple){
        setupCheckersPieces(game_pieces, RedChecker, BlackChecker);
    } else {
        setupSimpleCheckersPieces(game_pieces, RedChecker, BlackChecker);
    }

    redCheckerImg.onload = drawing.drawPieces.bind(this, game_pieces);

    return {
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}

function initChess(ctx) {

    var game_pieces = [];
    var pieceNamespace = PieceNamespace(game_pieces);
    var player1 = new ChessPlayer('white', game_pieces, pieceNamespace);
    var player2 = new ChessPlayer('black', game_pieces, pieceNamespace);


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

    player1.setKing();
    player2.setKing();

    whiteKing.onload = drawing.drawPieces.bind(this, game_pieces);

    return {
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace,
        player1: player1,
        player2: player2
    };
}