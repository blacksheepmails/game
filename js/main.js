var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var redCheckerKing = new Image();
redCheckerKing.src = "red_checker_king.png";
var blackCheckerKing = new Image();
blackCheckerKing.src = 'black_checker_king.png';

var drawing = Drawing(ctx);

var board_size = 400;
var square_size = board_size/10;

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


function mouseDown(ctx, canvas, game_pieces, checkersGame, e) {
    var square = getSquare(e.pageX - offset(canvas).x, e.pageY - offset(canvas).y);

    if (square != null) {
        checkersGame.next(square);
    }    
}

function initCheckers(ctx) {
    var blackCheckerImg = new Image();
    blackCheckerImg.src = "black_checker.png";
    var redCheckerImg = new Image();
    redCheckerImg.src = 'red_checker.png';

    var game_pieces = [];
    var pieceNamespace = PieceNamespace(game_pieces);

    var RedChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, redCheckerImg, 'red');
    };
    var BlackChecker = function(i, j){
        return new pieceNamespace.CheckersPiece(ctx, i, j, blackCheckerImg, 'black');
    };

    for (var i = 2; i <= 8; i += 2) {
        game_pieces.push(RedChecker(i - 1, 1));
        game_pieces.push(RedChecker(i, 2));
        game_pieces.push(RedChecker(i - 1, 3));

        game_pieces.push(BlackChecker(i, 6));
        game_pieces.push(BlackChecker(i - 1, 7));
        game_pieces.push(BlackChecker(i, 8));
    }

    redCheckerImg.onload = drawing.drawPieces.bind(this, game_pieces);

    return {
        game_pieces: game_pieces,
        pieceNamespace: pieceNamespace
    };
}


var main = function(){
    
    ctx.font = '20px Arial';

    var options = initCheckers(ctx);
    drawing.drawBoard();

    var game_pieces = options.game_pieces;
    var pieceNamespace = options.pieceNamespace;

    var checkersGame = new NormalCheckersStateMachine(game_pieces, pieceNamespace);

    canvas.onmousedown = mouseDown.bind(this, ctx, canvas, game_pieces, checkersGame);
};

main();
