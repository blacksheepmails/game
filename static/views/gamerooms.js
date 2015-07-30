var InlineUser = React.createClass({
    render: function() {
        return <span> {this.props.username}, </span>;
    }
});

var GameRoom = React.createClass({
    render: function() {
        return (<div>
                    <span>{this.props.game} </span>
                    ::::::::
                    <span>{this.props.players.map(function(player){
                        return <InlineUser key={player} username={player}/>}
                    )}</span>
                </div>);
    }
});


var ActiveGameRoomsList = React.createClass({
    render: function() {
        return (<div>
            <h1>Game ::::::: Players</h1>
            <ol>
                {this.props.games.map(function(game) {
                    var players = this.props.usernames.filter(function(name){
                        return this.props.users[name].game === game;
                    }.bind(this));
                    return (<li>
                        <GameRoom key={game} game={game} players={players}/>
                    </li>);
                }.bind(this))}
            </ol>
        </div>);
    }
});