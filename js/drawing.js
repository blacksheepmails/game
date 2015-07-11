var drawing = function(ctx){
	var drawSquare = function(x, y, color) {
	    ctx.fillStyle = color;
	    ctx.fillRect(x * square_size, y * square_size, square_size, square_size);
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


	return {
		drawSquare: drawSquare,
		drawBoard: drawBoard
	};
};