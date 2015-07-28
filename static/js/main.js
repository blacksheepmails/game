var socket = io.connect('/game_data');

var canvas = document.getElementById("myCanvas");


var ctx = canvas.getContext("2d");
var drawing = Drawing(ctx, canvas);

var img = new Img();

var date = new Date();

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
    var squareSize = drawing.getSettings().squareSize;
    var i = Math.floor(x / squareSize);
    var j = Math.floor(y / squareSize);

    if ((i >= 1 && i <= 8) && 
        (j >= 1 && j <= 8)) {
        return {
            i: i,
            j: j
        };
    } 

    return null;
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
            socket.emit('client_to_server_move', move);
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
            break;
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
    
    drawing.resize();

    $.get("/get_game_options", function(options) {
        ctx.font = '20px Arial';
        var init = null;
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


        var game = null;
        if (options.stateMachine === 'normal') game = GameStateMachine;
        else if (options.stateMachine == 'chess') game = NormalChessStateMachine;
        else if (options.stateMachine == 'checkers') game = NormalCheckersStateMachine;
        else if (options.stateMachine == 'weird_checkers') game = WeirdCheckersStateMachine;
        
        game = new game(game_pieces, player1, player2, pieceNamespace, myPlayer);

        drawing.drawPieces(game_pieces);
        game.updatePossibleMoves();
        
        canvas.addEventListener('mousedown', mouseDown.bind(this, ctx, canvas, game_pieces, game));
        canvas.addEventListener('mousemove', mouseMove.bind(this, canvas, game_pieces, game));

        document.addEventListener('keydown', function(e) {
            e = e? e : window.event;
            if (e.keyCode == '37') game.stepBack();
            if (e.keyCode == '39') game.stepForward();
            if (e.which === 90 && e.ctrlKey) socket.emit('undo_ask', '');
        });

        window.addEventListener("resize", function(){
            drawing.resize();
            drawing.drawBoard();
            drawing.drawPieces(game_pieces);
        }, true);

        socket.emit('start_game', '');
        
        socket.on('server_to_client_move', function(move) {
            if (move === '' || move === null) return;
            
            if (game.lastMove == null || move.time !== game.lastMove.time) {
                game.fastForward();
                game.makeMove(move.from, move.to);
            }
        });

        socket.on('undo_answer', function(ans) {
            if(ans != 'yes'){
                console.log('undo rejected');
                return;
            }

            game.fastForward();
            game.undo();
        });

        socket.on('undo_ask', function(name) {
            var ans = window.confirm('player ' + name + ' is a cheat and wants to undo. will you allow it?');
            
            if (ans) socket.emit('undo_answer', 'yes');
            else socket.emit('undo_answer', 'no');
        });
    });


};
window.onload = main;
