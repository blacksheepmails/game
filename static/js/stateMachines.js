
function GameStateMachine(gamePieces, player1, player2, pieceNamespace, myPlayer) {
    this.gamePieces = gamePieces;
    this.pieceNamespace = pieceNamespace;
    this.player1 = player1;
    this.player2 = player2;
    this.whoseTurn = player1;
    this.activePiece = null;
    this.myPlayer = myPlayer;
    this.lastMove = null;
    this.log = [];
    this.stepPointer = null;
}

GameStateMachine.prototype = {
    deactivate: function(gamePiece) {
        if (typeof gamePiece === "undefined") gamePiece = this.activePiece;
        if (gamePiece != null) gamePiece.isActive = false;
        drawing.drawBoard();
        drawing.drawPieces(this.gamePieces);
        this.activePiece = null;  
    },
    
    activate: function(gamePiece) {
        gamePiece.isActive = true;
        this.activePiece = gamePiece;
        gamePiece.draw();
    },

    isTurn: function(player) {
        if (player instanceof Player) {
            return (this.whoseTurn === player || this.whoseTurn === 'both');
        } 

        for (var c = 0; c < player.length; c++) {
            if (this.isTurn(player[c])) return true;
        }
        
        return false;
    },

    isTurnStrict: function(player) {
        if (player instanceof Player) {
            return (this.whoseTurn === player);
        } 
        for (var c=0; c<player.length; c++) {
            if (this.isTurn(player[c])) return true;
        }

        return false;
    },

    toggleTurn: function() {
        if (this.whoseTurn == 'both') {
            this.whoseTurn = (this.activePiece.color == this.player1.color)? this.player2 : this.player1;
        } else {
            this.whoseTurn = (this.whoseTurn === this.player1)? this.player2 : this.player1;
        }
    },
    shouldActivate: function(game_piece) {
        if (this.stepPointer != null) return false;
        return (game_piece != null && this.isTurn(game_piece.player) && this.isTurn(this.myPlayer));
    },
    isGameOver: function() {
        return false;
    },
    getPieces: function(player) {
        return this.gamePieces.filter(function(a) {return a.player === player;})
    },
    updatePossibleMoves: function() {
        for (var c = 0; c < this.gamePieces.length; c++) {
            this.gamePieces[c].calcPossibleMoves();
        }
        if (this.activePiece != null) this.activePiece.calcPossibleMoves();
    },
    move: function(piece, square, msg) {
        var move = piece.getMove(square.i, square.j);
        this.log.push({piece: piece, from: {i: piece.i, j: piece.j}, move: move, turn: this.whoseTurn});
        move.sideEffects.map(function(x) {x.go(msg)});
        piece.i = square.i;
        piece.j = square.j;
        this.updatePossibleMoves();
    },

    makeMove: function(from, to, msg) {
        if (typeof msg === 'undefined') msg = 'from makeMove';
        var piece = getGamePiece(this.gamePieces, from.i, from.j);
        this.lastMove = this.makeMoveObject(to, piece);
        this.move(piece, to, msg);
        this.toggleTurn();
        this.deactivate(piece);
    },
    moveBack: function(log) {
        log.piece.i = log.from.i;
        log.piece.j = log.from.j;
        log.move.sideEffects.map(function(x) {x.inverse()});
        this.updatePossibleMoves();
        this.deactivate();
    },
    moveForward: function(log) {
        log.piece.i = log.move.i;
        log.piece.j = log.move.j;
        log.move.sideEffects.map(function(x) {x.go()});
        this.updatePossibleMoves();
        this.deactivate();
    },
    undo: function() {
        var log = this.log.pop();
        this.moveBack(log);
        this.whoseTurn = log.turn;
    },
    stepBack: function() {
        if (this.stepPointer == null) this.stepPointer = this.log.length;
        if (this.stepPointer <= 0) return;
        this.stepPointer -= 1;
        var log = this.log[this.stepPointer];
        this.moveBack(log);
    },
    stepForward: function() {
        if (this.stepPointer == null || this.stepPointer >= this.log.length) return;
        var log = this.log[this.stepPointer];
        this.moveForward(log);
        this.stepPointer += 1;
        if (this.stepPointer == this.log.length) this.stepPointer = null;
    },
    fastForward: function() {
        console.log(this.stepPointer);
        while (this.stepPointer != null) {
            console.log('fastforwarding');
            this.stepForward();
        }
    },
    makeMoveObject: function(square, piece) {
        if (typeof piece === 'undefined') piece = this.activePiece;
        return {from: {i: piece.i, j: piece.j}, 
                to: square,
                color: piece.color,
                time: Date.now()};
    },
    next: function(square) {
        if (this.activePiece == null) {
            var game_piece = getGamePiece(this.gamePieces, square.i, square.j);
            if (this.shouldActivate(game_piece)) this.activate(game_piece);
            return;
        }

        if (this.activePiece.i == square.i && this.activePiece.j == square.j) {
            this.deactivate();
            return;
        }
        var move = null;
        var isValidMove = this.activePiece.isValidMove(square.i, square.j);
        
        if (isValidMove){
            move = this.makeMoveObject(square);
            this.lastMove = move;
            this.move(this.activePiece, square);
            this.toggleTurn();
            this.deactivate();
        } 

        if (this.isGameOver()){
            console.log("Game over!");
        }
        return move;
    }
}

