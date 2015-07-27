import redis
import ast
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
app.undoLog = {}
db = redis.StrictRedis(host='localhost', port=6379, db=0)


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
        session['game'] = request.form['gamename']
        session['player'] = request.form['player']
        session['setup'] = request.form['setup']
        session['stateMachine'] = request.form['stateMachine']
        app.users.append({
            'username': session['username'],
            'game': session['game'],
            'player': session['player'],
            'setup': session['setup'],
            'stateMachine': session['stateMachine']
        })

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
    if session['game'] in app.undoLog:
        undo_tell('no')
    emit('server_to_client_move', move, room = session['game'])
    #app.log[session['game']].append(move)
    db.rpush(session['game'], str(move))

@socketio.on('start_game', namespace='/game_data')
def start_game(stuff):
    join_room(session['game'])
    #for move in app.log[session['game']]:
    for move in db.lrange(session['game'], 0, -1):
        emit('server_to_client_move', ast.literal_eval(move))

@socketio.on('undo_ask', namespace='/game_data')
def undo_ask(stuff):
    emit('undo_ask', session['username'], room = session['game'])
    app.undoLog[session['game']] = set([session['username']])

@socketio.on('undo_answer', namespace='/game_data')
def undo_answer(ans):
    if ans == 'no':
        undo_tell('no')

    c = len(filter(lambda user: user['game'] == session['game'], app.users))

    if session['game'] in app.undoLog:
        app.undoLog[session['game']].add(session['username'])
        if len(app.undoLog[session['game']]) == c:
            undo_tell('yes')

def undo_tell(ans):
    emit('undo_answer', ans, room = session['game'])
    del app.undoLog[session['game']]
    db.rpop(session['game'])

if __name__ == '__main__':
    socketio.run(app)