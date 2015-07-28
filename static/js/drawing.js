var Drawing = function(ctx, canvas){
    var boardSize = canvas.height;
    var squareSize = boardSize / 10;

    var drawSquare = function(i, j, color) {
        ctx.fillStyle = color;
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    };

    var drawBoard = function() {

        var color = 'red';
        for (var i = 1; i <= 8; i += 1) {
            color = toggleColor(color);
            for (var j = 1; j <= 8; j += 1) {
                color = toggleColor(color);
                drawSquare(i, j, color);
            }
        }

        ctx.font = (boardSize / 20).toString() + "px Arial";

        for (var i = 1; i <= 8; i++) {
            var letter = String.fromCharCode(96 + i);

            ctx.fillText(letter, i * squareSize, 20);
            ctx.fillText(letter, i * squareSize, boardSize - 10);
        }
        for (var j = 1; j <= 8; j++) {
            ctx.fillText(j.toString(), 10, (j + 1) * squareSize);
            ctx.fillText(j.toString(), boardSize - 20, (j + 1) * squareSize);
        }
    };
    
    var toggleColor = function(color) {
        return (color === 'red') ? 'black' : 'red';
    };

    var drawPieces = function(pieces) {
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].draw();
        }
    }

    var drawCaptured = function(pieces) {
        black = pieces.filter(function(a){return a.color === 'black'});
        not_black = pieces.filter(function(a){return a.color != 'black'});
    }

    var resize = function(){
        if (window.innerHeight < window.innerWidth){
            canvas.height = window.innerHeight - 20;
            canvas.width = canvas.height;
        } else {
            canvas.width = window.innerWidth - 20;
            canvas.height = canvas.width;
        }

        boardSize = canvas.height;
        squareSize = boardSize / 10;
    };

    return {
        drawSquare: drawSquare,
        drawBoard: drawBoard,
        drawPieces: drawPieces,
        resize: resize
    };
};
