
var square_size = 240/8.0;
var board_size = 300;


var toggleColor = function(color) {
    if (color === 'red') {
        return 'black';
    } else {
        return 'red';
    }
};

var GamePiece = function(ctx, x, y, piece, color) {
	this.ctx = ctx
	this.x = x;
	this.y = y;
	this.piece = piece;
	this.color = color;

	this.draw = function() {
		ctx.drawImage(this.piece, this.x * square_size, this.y * square_size, square_size, square_size);
	};
};


var main = function(){
	var c = document.getElementById("myCanvas");

	var ctx = c.getContext("2d");
	ctx.font = '20px Arial';

	
	drawing(ctx).drawBoard();

	var blackChecker = new Image();
	blackChecker.src = "black_checker.png";

	var blackPiece = new GamePiece(ctx, 2, 2, blackChecker, 'black');
	blackChecker.onload = function(){
		blackPiece.draw();
	};

};

main();
