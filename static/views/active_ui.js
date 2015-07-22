var ActiveDisplay = React.createClass({
    getInitialState: function() {
        return {
            games: [],
            users: []
        };
    },
    componentDidMount: function() {
        setInterval(Requests.loadGames.bind(this), 300);
        setInterval(Requests.loadUsers.bind(this), 300);
    },
    render: function() {
        return (
            <div>
                <ActiveUsersCount users={this.state.users}/>
                <ActiveUsersList users={this.state.users}/>
                <ActiveGamesCount games={this.state.games}/>
                <ActiveGamesList games={this.state.games}/>
            </div>
        );
    }
});