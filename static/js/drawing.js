var Drawing = function(ctx){
	var drawSquare = function(i, j, color) {
	    ctx.fillStyle = color;
	    ctx.fillRect(i * square_size, j * square_size, square_size, square_size);
	};

	var drawBoard = function() {
		if (window.innerHeight < window.innerWidth){
            canvas.height = window.innerHeight - 20;
            canvas.width = canvas.height;
        } else {
            canvas.width = window.innerWidth - 20;
            canvas.height = canvas.width;
        }
        board_size = canvas.height;
        square_size = board_size / 10;

		var color = 'red';
		for (var i = 1; i <= 8; i += 1) {
			color = toggleColor(color);
		    for (var j = 1; j <= 8; j += 1) {
		        color = toggleColor(color);
		        drawSquare(i, j, color);
		    }
		}
		ctx.font=(board_size/20).toString() + "px Arial";
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
    
    var toggleColor = function(color) {
        return (color === 'red')? 'black' : 'red';
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

	return {
		drawSquare: drawSquare,
		drawBoard: drawBoard,
		drawPieces: drawPieces
	};
};
