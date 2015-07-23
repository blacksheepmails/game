var canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight - 20;
canvas.width = canvas.height;

var ctx = canvas.getContext("2d");
var drawing = Drawing(ctx);
var img = new Img();

var date = new Date();

var board_size = canvas.height;
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

var currentSquareUnderMouse = function(canvas, e){
    return getSquare(e.pageX - offset(canvas).x, e.pageY - offset(canvas).y);
};

function mouseDown(ctx, canvas, game_pieces, game, e) {
    var square = currentSquareUnderMouse(canvas, e);

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
};

var isClickable = function(canvas, game_pieces, game, e){
    var isMyTurn = game.isTurn(game.myPlayer);
    if (!isMyTurn) return false;

    var square = currentSquareUnderMouse(canvas, e);
    if (square === null) return false;

    var piece = getGamePiece(game_pieces, square.i, square.j);

    if (piece === null) return false; 

    var found = false;
    for (var i = 0; i < game.myPlayer.length; i++){
        if (piece.player == game.myPlayer[i]){
            found = true;
        }
    }

    if (!found) return false;

    piece.calcPossibleMoves();
    
    return piece.possibleMoves.length > 0;
};

var mouseMove = function(canvas, game_pieces, myPlayer, e){
    if (isClickable(canvas, game_pieces, myPlayer, e)){
        $('#myCanvas').css( 'cursor', 'pointer');
    } else {
        $('#myCanvas').css('cursor', 'default');
    }
};

var main = function(){    


    $.get("/get_game_options", function(options) {
        ctx.font = '20px Arial';
        var init
        console.log(options);
        if (options.setup == 'simple_checkers') init = initCheckers(ctx,true);
        else if (options.setup == 'checkers') init = initCheckers(ctx);
        else if (options.setup == 'simple_chess') init = initChess(ctx,true);
        else if (options.setup == 'chess') init = initChess(ctx);
        else console.log('this is not init with valid setup');

        drawing.drawBoard();

        var game_pieces = init.game_pieces;
        var pieceNamespace = init.pieceNamespace;

        var player1 = init.player1;
        var player2 = init.player2;

        var myPlayer = [];
        if (options.player === 'white') myPlayer = [player1];
        else if (options.player === 'black') myPlayer = [player2];
        else if (options.player === 'both') myPlayer = [player1, player2];


        var game
        if (options.stateMachine === 'normal') game = GameStateMachine;
        else if (options.stateMachine == 'chess') game = NormalChessStateMachine;
        else if (options.stateMachine == 'checkers') game = NormalCheckersStateMachine;
        else if (options.stateMachine == 'weird_checkers') game = WeirdCheckersStateMachine;
        game = new game(game_pieces, player1, player2, pieceNamespace, myPlayer);

        drawing.drawPieces(game_pieces);

        canvas.onmousedown = mouseDown.bind(this, ctx, canvas, game_pieces, game);
        canvas.addEventListener('mousemove', mouseMove.bind(this, canvas, game_pieces, game));

        window.addEventListener("resize", function(){
            if (window.innerHeight < window.innerWidth){
                canvas.height = window.innerHeight - 20;
                canvas.width = canvas.height;
            } else {
                canvas.width = window.innerWidth - 20;
                canvas.height = canvas.width;
            }

            board_size = canvas.height;
            square_size = board_size / 10;
            drawing.drawBoard();
            drawing.drawPieces(game_pieces);
        }, true);
        setInterval(function(){
            $.get("/get_move", function(move) {
                if (move === '' || move === null) return;
                if (game.lastMove == null || move.time !== game.lastMove.time) {
                    console.log(move);
                    game.makeMove(move.from, move.to);
                }
            });
        }, 1000);
    });


};
window.onload = main;
