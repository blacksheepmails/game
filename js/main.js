
var square_size = 240/8.0;
var board_size = 300;

var c = document.getElementById("myCanvas");

var ctx = c.getContext("2d");
ctx.font = '20px Arial';


var drawSquare = function(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * square_size, y * square_size, square_size, square_size);
};

var toggleColor = function(color) {
    if (color === 'red') {
        return 'black';
    } else {
        return 'red';
    }
};

var gamePiece = function(x, y, piece, color) {
	this.x = x;
	this.y = y;
	this.piece = piece;
	this.color = color;
	this.draw = function() {
		console.log('here');
		ctx.drawImage(this.piece, this.x * square_size, this.y * square_size, square_size, square_size);
	};
};

var drawBoard = function() {
	var color = 'red';
	for (var x = 1; x <= 8; x += 1) {
		color = toggleColor(color);
	    for (var y = 1; y <= 8; y += 1) {
	        color = toggleColor(color);
	        drawSquare(x, y, color);
	    }
	}

	for (var y = 1; y <= 8; y++) {
	 	ctx.fillText(y.toString(), 10, (y+1) * square_size);
	 	ctx.fillText(y.toString(), board_size-20, (y+1) * square_size);
	}

	for (var x = 1; x <= 8; x++) {
	 	var letter = String.fromCharCode(96+x);
	  	ctx.fillText(letter, x * square_size, 20);
	 	ctx.fillText(letter, x * square_size, board_size-10);
	}
};



var main = function(){
	drawBoard();

	var blackChecker = new Image();
	blackChecker.src = "black_checker.png";

	var blackPiece = new gamePiece(2, 2, blackChecker, 'black');
	blackChecker.onload = function(){
		//ctx.drawImage(blackChecker, 30, 30, 30, 30);
		blackPiece.draw();
	}
};

main();
