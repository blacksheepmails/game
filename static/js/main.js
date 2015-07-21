var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

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
    


var drawing = Drawing(ctx);

var board_size = canvas.width;
var square_size = board_size / 10;

var offset = function(canvas) {
    var x = 0;
    var y = 0;

    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;

    var element = canvas;

    while (element.offsetParent) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    }
    
    x += stylePaddingLeft;
    y += stylePaddingTop;
    x += styleBorderLeft;
    y += styleBorderTop;

    return {
        x: x,
        y: y
    };
}

function getSquare(x, y) {
    var i = Math.floor(x / square_size);
    var j = Math.floor(y / square_size);

    if ((i >= 1 && i <= 8) && 
        (j >= 1 && j <= 8)) {
        return {
            i: i,
            j: j
        };
    } else {
        return null;
    }
}

function getGamePiece(game_pieces, i, j) {
    for (var c = 0; c < game_pieces.length; c++) {
        if (game_pieces[c].i == i && game_pieces[c].j == j) {
            return game_pieces[c];
        }
    }
    return null;
}


function mouseDown(ctx, canvas, game_pieces, game, e) {
    var square = getSquare(e.pageX - offset(canvas).x, e.pageY - offset(canvas).y);

    if (square != null) {

        $.ajax({
            type: "POST",
            url: "/post_click",
            data: JSON.stringify(square),
            dataType: "json",
            contentType: "application/json"
        });

        //checkersGame.next(square);
    }    
}

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

var main = function(){
    
    ctx.font = '20px Arial';

    var init = initChess(ctx);
    drawing.drawBoard();

    var game_pieces = init.game_pieces;
    var pieceNamespace = init.pieceNamespace;

    var game = new NormalChessStateMachine(game_pieces, init.player1, init.player2, pieceNamespace);

    canvas.onmousedown = mouseDown.bind(this, ctx, canvas, game_pieces, game);

    setInterval(function(){
        $.get("/get_click", function(square) {
            if (square == '') return;
            console.log(square);
            game.next(square);
        });
    }, 1000);
};

main();
