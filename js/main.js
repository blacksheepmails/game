
var square_size = 240/8.0;
var board_size = 300;
var game_pieces = [];

var offset = function (canvas) {
	var x = 0;
	var y = 0;

	stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;

    var element = canvas;
	if (element.offsetParent) {
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
        } while ((element = element.offsetParent));
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
	var i = Math.floor(x/square_size);
	var j = Math.floor(y/square_size);
	if (i >= 1 && i <= 8 && j >= 1 && j <= 8) {
		return {
			i: i,
			j: j
		};
	} else {
		return 'None';
	}
}

function getGamePiece(i, j) {
	for (var c = 0; c < game_pieces.length; c++) {
		if (game_pieces[c].i == i && game_pieces[c].j == j) {
			return game_pieces[c]
		}
	}
	return 'None'
}

function mouseDown(e) {
	var canvas = document.getElementById('myCanvas');
	var square = getSquare(e.pageX - offset(canvas).x, e.pageY - offset(canvas).y);
	if (square != 'None') {
		var game_piece = getGamePiece(square.i, square.j);
		if (game_piece != 'None') {
			console.log('clicked on a game piece!');
			game_piece.isActive = true;
			game_piece.draw();
		} else {
			console.log('clicked on a square thats not a game piece!');
		}
	} else {
		console.log('watch where you click, bitch');
	}
}

var toggleColor = function(color) {
    if (color === 'red') {
        return 'black';
    } else {
        return 'red';
    }
};

var GamePiece = function(ctx, i, j, piece, color) {
	this.ctx = ctx
	this.i = i;
	this.j = j;
	this.piece = piece;
	this.color = color;
	this.isActive = false;

	this.draw = function() {
		if (this.isActive) {
			ctx.lineWidth="5";
			ctx.strokeStyle="yellow";
			ctx.rect(this.i * square_size, this.j * square_size, square_size, square_size);
			ctx.stroke();
			ctx.drawImage(this.piece, this.i * square_size, this.j * square_size, square_size, square_size);
		} else {
			ctx.drawImage(this.piece, this.i * square_size, this.j * square_size, square_size, square_size);
		}
	};
};


var main = function(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.font = '20px Arial';

	var blackCheckerImg = new Image();
	blackCheckerImg.src = "black_checker.png";
	var redCheckerImg = new Image();
	redCheckerImg.src = 'red_checker.png';

	game_pieces.push (new GamePiece(ctx, 2, 2, blackCheckerImg, 'black'));
	game_pieces.push (new GamePiece(ctx, 2, 4, blackCheckerImg, 'black'));
	game_pieces.push (new GamePiece(ctx, 2, 5, redCheckerImg, 'red'));
	game_pieces.push (new GamePiece(ctx, 2, 6, blackCheckerImg, 'black'));
	game_pieces.push (new GamePiece(ctx, 2, 8, blackCheckerImg, 'black'));
	game_pieces.push (new GamePiece(ctx, 2, 10, blackCheckerImg, 'black'));

	drawing(ctx).drawBoard();
	canvas.onmousedown = mouseDown;
	redCheckerImg.onload = drawing(ctx).drawPieces.bind(this, game_pieces);
	//setInterval(drawing(ctx).drawPieces.bind(this, game_pieces), 1000);
};

main();
