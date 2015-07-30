var ActiveDisplay = React.createClass({
    getInitialState: function() {
        return {
            //games: [],
            users: []
        };
    },
    componentDidMount: function() {
        //setInterval(Requests.loadGames.bind(this), 700);
        setInterval(Requests.loadUsers.bind(this), 700);
    },
    render: function() {
        var usernames = Object.keys(this.state.users);
        var games = usernames.map(function(name){return this.state.users[name].game}.bind(this));
        var uniqueGames = [];
        $.each(games, function(i, el){
            if($.inArray(el, uniqueGames) === -1) uniqueGames.push(el);
        });
        games = uniqueGames;
        console.log(games);
        return (
            <div>
                <ActiveUsersCount users={usernames}/>
                <ActiveUsersList users={usernames}/>
                <ActiveGamesCount games={games}/>
                <ActiveGamesList games={games}/>
                <ActiveGameRoomsList games={games} usernames={usernames} users={this.state.users}/>
            </div>
        );
    }
});