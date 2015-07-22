var User = React.createClass({
    render: function() {
        return <div>Name: {this.props.username} </div>;
    }
});

var ActiveUsersCount = React.createClass({
    render: function() {
        if (this.props.users.length < 1){
            return <div> There are no active users. </div>;
        }

        return <div>There are currently {this.props.users.length} active users!</div>;
    }
});

var ActiveUsersList = React.createClass({
    render: function() {
        return (
        <ul>
            {this.props.users.map(function(name) {
                return (<li>
                    <User key={name} username={name}/>
                </li>);
            })}
        </ul>);
    }
});
