var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
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
        var move = game.next(square);
        if (move != null) {
            $.ajax({
                type: "POST",
                url: "/post_move",
                data: JSON.stringify(move),
                dataType: "json",
                contentType: "application/json"
            });
        }
    }    
}


var main = function(){
    
    ctx.font = '20px Arial';

    var init = initChess(ctx, true);
    drawing.drawBoard();

    var game_pieces = init.game_pieces;
    var pieceNamespace = init.pieceNamespace;

    var game = new NormalChessStateMachine(game_pieces, init.player1, init.player2, pieceNamespace);

    canvas.onmousedown = mouseDown.bind(this, ctx, canvas, game_pieces, game);

    setInterval(function(){
        $.get("/get_move", function(move) {
            console.log(move);
            if (move.color === game.whoseTurn.color) {
                game.makeMove(move.from, move.to);
            }
        });
    }, 1000);
};

main();
