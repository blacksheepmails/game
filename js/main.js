
var square_size = 240/8.0;
var board_size = 300;
var game_pieces = [];
var activePiece = 'None';

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
		console.log(activePiece);
		if (activePiece == 'None') {
			var game_piece = getGamePiece(square.i, square.j);
			if (game_piece != 'None') {
				game_piece.isActive = true;
				activePiece = game_piece;
				game_piece.draw();
				console.log ('selected: ' + game_piece.toString());
			}
		} else if (activePiece.i == square.i && activePiece.j == square.j) {
            activePiece.isActive = false;
	        drawing(activePiece.ctx).drawBoard();
	        drawing(activePiece.ctx).drawPieces(game_pieces);
	        activePiece = 'None';
        } else if (activePiece.isValidMove(square.i, square.j)) {
            activePiece.getMove(square.i, square.j).sideEffects.map(function (x) {x();});
			activePiece.i = square.i;
			activePiece.j = square.j;
            activePiece.isActive = false;
	        drawing(activePiece.ctx).drawBoard();
	        drawing(activePiece.ctx).drawPieces(game_pieces);
	        activePiece = 'None';
		}
	}
}

function toggleColor(color) {
    if (color === 'red') {
        return 'black';
    } else {
        return 'red';
    }
};

function initCheckers(ctx) {
	var blackCheckerImg = new Image();
	blackCheckerImg.src = "black_checker.png";
	var redCheckerImg = new Image();
	redCheckerImg.src = 'red_checker.png';

	for (var i=2; i<=8; i+=2) {
		game_pieces.push (new CheckersPiece(ctx, i-1, 1, redCheckerImg, 'red'));
		game_pieces.push (new CheckersPiece(ctx, i, 2, redCheckerImg, 'red'));
		game_pieces.push (new CheckersPiece(ctx, i-1, 3, redCheckerImg, 'red'));
		game_pieces.push (new CheckersPiece(ctx, i, 6, blackCheckerImg, 'black'));
		game_pieces.push (new CheckersPiece(ctx, i-1, 7, blackCheckerImg, 'black'));
		game_pieces.push (new CheckersPiece(ctx, i, 8, blackCheckerImg, 'black'));
	}

	drawing(ctx).drawBoard();
	redCheckerImg.onload = drawing(ctx).drawPieces.bind(this, game_pieces);
}


GamePiece = function(ctx, i, j, piece, color) {
	this.ctx = ctx
	this.i = i;
	this.j = j;
	this.piece = piece;
	this.color = color;
};
function capturePiece(piece) {
    game_pieces.splice(game_pieces.indexOf(piece), 1);
}

CheckersKingPiece = function(ctx, i, j, piece, color) {
	GamePiece.call(this, ctx, i, j, piece, color);
	this.possibleMoves = function() {
		var moves = [];
		for (var i_dir = -1; i_dir <= 1; i_dir += 2) {
			for (var j_dir = -1; j_dir <= 1; j_dir += 2) {
				var piece = getGamePiece(this.i+i_dir, this.j+j_dir)
				if (piece == 'None') {
					moves.push({i: this.i+i_dir, j: this.j+j_dir, sideEffects: []});
				} else if (piece.color != color) {
					if (getGamePiece(this.i+2*i_dir, this.j+2*j_dir) == 'None') {
						moves.push({i: this.i+2*i_dir, j: this.j+2*j_dir, sideEffects: [capturePiece.bind(this, piece)]});
					}
				}
			}
		}
		return moves;
	}
}

CheckersPiece = function(ctx, i, j, piece, color) {
	GamePiece.call(this, ctx, i, j, piece, color);
	this.possibleMoves = function() {
		var moves = [];
        var j_dir = (color == 'black')? -1: 1;
		for (var i_dir = -1; i_dir <= 1; i_dir += 2) {
		    var piece = getGamePiece(this.i+i_dir, this.j+1*j_dir)
			if (piece == 'None') {
				moves.push({i: this.i+i_dir, j: this.j+1*j_dir, sideEffects: []});
			} else if (piece.color != color) {
				if (getGamePiece(this.i+2*i_dir, this.j+2*j_dir) == 'None') {
					moves.push({i: this.i+2*i_dir, j: this.j+2*j_dir, sideEffects: [capturePiece.bind(this, piece)]});
				}
			}
		}
        for (var c = 0; c < moves.length; c++) {
            if (this.isLastRow(moves[c].j)) {
                moves[c].sideEffects.push(this.kingMe.bind(this, moves[c]));
            }
        }
		return moves;
	}
    this.isLastRow = function(j) {
        if (color == 'black' && j == 1 || color == 'red' && j == 8) {
            return true;
        }
        return false;
    }
    this.kingMe = function(move) {
        game_pieces.splice(game_pieces.indexOf(this), 1, new CheckersKingPiece(this.ctx, move.i, move.j, this.piece, this.color));
    }
}

GamePiece.prototype = {
	isActive: false,
	possibleMoves: function() {
		return 'None';
	},
	isValidMove: function(i, j) {
		var validMoves = this.possibleMoves();
		for (var c=0; c<validMoves.length; c++) {
			if (validMoves[c].i == i && validMoves[c].j == j) {
				console.log(i.toString() + ', ' + j.toString() + ' is a valid move');
				return true;
			}
		}
		return false;
	},
    getMove: function(i, j) {
    //should save possible moves instead of clculating them each time. anyways make this better later.
        var validMoves = this.possibleMoves();
        for (var c=0; c<validMoves.length; c++) {
			if (validMoves[c].i == i && validMoves[c].j == j) {
				return validMoves[c];
			}
		}
    },
	draw : function() {
		if (this.isActive) {
			this.ctx.lineWidth="5";
			this.ctx.strokeStyle="yellow";
			this.ctx.strokeRect(this.i * square_size, this.j * square_size, square_size, square_size);
			this.ctx.drawImage(this.piece, this.i * square_size, this.j * square_size, square_size, square_size);
		} else {
			this.ctx.drawImage(this.piece, this.i * square_size, this.j * square_size, square_size, square_size);
		}
	}
}

CheckersKingPiece.prototype = Object.create(GamePiece.prototype);
CheckersPiece.prototype = Object.create(GamePiece.prototype);

var main = function(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.font = '20px Arial';

	initCheckers(ctx);

	canvas.onmousedown = mouseDown;
};

main();
