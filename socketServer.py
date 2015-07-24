from flask import Flask, current_app
from flask import jsonify, redirect, url_for, escape
from flask import request,  session 
from flask import g as Globals
from flask.ext.socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

socketio = SocketIO(app)
app.users = []
app.log = {}


@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/game')
def root():
    if 'username' in session:
        game_id = request.args.get('game')
        session['game'] = game_id
        return app.send_static_file('game.html')
    return redirect(url_for('login'))

@app.route('/users', methods=['GET'])
def logged_in_users():
    return jsonify({'users': app.users})

@app.route('/games', methods=['GET'])
def active_games():
    return jsonify({'games': list(app.log.keys())})

@app.route('/active', methods=['GET'])
def active_page():
    return app.send_static_file('views/active.html')

@app.route('/get_game_options', methods=['GET'])
def get_game_options():
    obj = {'player': session['player'], 'setup': session['setup'], 'stateMachine': session['stateMachine']}
    return (jsonify(obj))

@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        app.users.append(session['username'])

        session['game'] = request.form['gamename']
        session['player'] = request.form['player']
        session['setup'] = request.form['setup']
        session['stateMachine'] = request.form['stateMachine']
        session['outCount'] = 0

        if session['game'] not in app.log:
            app.log[session['game']] = []

        return redirect(url_for('root', game=session['game']))

    return app.send_static_file('views/login.html')

@app.route('/logout')
def logout():
	#leave_room(session['game'])
	if 'username' in session:
		app.users.remove(session['username'])
		session.pop('username', None)

	return redirect(url_for('index'))



@socketio.on('client_to_server_move', namespace='/game_data')
def received_move(move):
	if 'username' in session:
		emit('server_to_client_move', move, room = session['game'])

@socketio.on('start_game', namespace='/game_data')
def start_game(stuff):
	if 'username' in session:
		join_room(session['game'])



if __name__ == '__main__':
    socketio.run(app)