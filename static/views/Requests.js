var Requests = {
    loadGames: function() {
        $.ajax({
            url: 'games',
            dataType: 'json',
            success: function(data){
                this.setState({
                   games: data['games'] 
                });
            }.bind(this)
        });
    },
    loadUsers: function() {
        $.ajax({
            url: 'users',
            dataType: 'json',
            success: function(data){
                this.setState({
                   users: data['users'] 
                });
            }.bind(this)
        });
    },
};