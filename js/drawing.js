var drawing = function(ctx){
	var drawSquare = function(i, j, color) {
	    ctx.fillStyle = color;
	    ctx.fillRect(i * square_size, j * square_size, square_size, square_size);
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
		for (var i = 1; i <= 8; i++) {
		 	var letter = String.fromCharCode(96+i);
		  	ctx.fillText(letter, i * square_size, 20);
		 	ctx.fillText(letter, i * square_size, board_size-10);
		}
		for (var j = 1; j <= 8; j++) {
		 	ctx.fillText(j.toString(), 10, (j+1) * square_size);
		 	ctx.fillText(j.toString(), board_size-20, (j+1) * square_size);
		}
	};

	var drawPieces = function(pieces) {
		for (var i = 0; i < pieces.length; i++) {
			pieces[i].draw();
		}
	}

	return {
		drawSquare: drawSquare,
		drawBoard: drawBoard,
		drawPieces: drawPieces
	};
};