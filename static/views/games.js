var Game = React.createClass({
    render: function() {
        return <div>Name: {this.props.name} </div>;
    }
});

var ActiveGamesCount = React.createClass({
    render: function() {
        if (this.props.games.length < 1){
            return <div> There are no active games. </div>;
        }
        
        return <div>There are currently {this.props.games.length} active games!</div>;
    }
});

var ActiveGamesList = React.createClass({
    render: function() {
        return (
        <ul>
            {this.props.games.map(function(name) {
                return (<li>
                    <Game key={name} name={name}/>
                </li>);
            })}
        </ul>);
    }
});