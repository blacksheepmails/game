import redis
import ast
from flask import Flask, current_app
from flask import jsonify, redirect, url_for, escape
from flask import request,  session 
from flask import g as Globals
from flask.ext.socketio import SocketIO, emit, join_room, leave_room, disconnect

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'secret!'
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

socketio = SocketIO(app)
app.users = {}
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

@app.route('/closed_connection')
def closed_connection():
    return 'connection is closed'

@app.route('/games', methods=['GET'])
def active_games():
    return jsonify({'games': list(app.log.keys())})

@app.route('/active', methods=['GET'])
def active_page():
    return app.send_static_file('views/active.html')

@app.route('/get_game_options', methods=['GET'])
def get_game_options():
    obj = {
        'player': session['player'],
        'setup': session['setup'],
        'stateMachine': session['stateMachine'],
        'username': session['username']
    }
    return jsonify(obj)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        session['game'] = request.form['gamename']
        session['player'] = request.form['player']
        session['setup'] = request.form['setup']
        session['stateMachine'] = request.form['stateMachine']

        return redirect(url_for('root', game=session['game']))

    return app.send_static_file('views/login.html')

@app.route('/logout')
def logout():
    if 'username' in session:
        if session['username'] in app.users:
            del app.users[session['username']]
        session.pop('username', None)
    return redirect(url_for('login'))

# @app.after_request
# def add_header(response):
#     response.headers['Cache-Control'] = 'public, max-age=0'
#     return response


def is_valid_user():
    if 'username' not in session:
        return False

    return session['username'] in app.users

@socketio.on('connect', namespace='/game_data')
def handle_connect():
    if 'username' not in session:
        disconnect()
        return
    app.users[session['username']] = {
        'game': session['game'],
        'player': session['player'],
        'setup': session['setup'],
        'stateMachine': session['stateMachine']
    }
    join_room(session['game'])
    for move_string in db.lrange(session['game'], 0, -1):
        move = ast.literal_eval(move_string)
        emit('server_to_client_move', move)
        if 'info' in move:
            emit('picking_piece', 'eeeeeeeeeeeeeeeeeeee')
            emit('picked_piece', move['info'])

@socketio.on('disconnect', namespace='/game_data')
def handle_disconnect():
    emit('disconnect')
    if 'username' in session and session['username'] in app.users:
        del app.users[session['username']]
    leave_room(session['game'])

@socketio.on('client_to_server_move', namespace='/game_data')
def received_move(move):
    if not is_valid_user():
        disconnect()
        return
    if session['game'] in app.undoLog:
        undo_tell('no')
    emit('server_to_client_move', move, room = session['game'])
    db.rpush(session['game'], str(move))

@socketio.on('picking_piece', namespace='/game_data')
def picking_piece(stuff):
    print('picking_piece')
    emit('picking_piece', session['username'], room = session['game'])

@socketio.on('picked_piece', namespace='/game_data')
def picked_piece(piece):
    print('picked_piece')
    move = ast.literal_eval(db.rpop(session['game']))
    move['info'] = piece;
    db.rpush(session['game'], str(move))
    emit('picked_piece', piece, room = session['game'])

@socketio.on('undo_ask', namespace='/game_data')
def undo_ask(stuff):
    if not is_valid_user():
        disconnect()
        return
    emit('undo_ask', session['username'], room = session['game'])
    app.undoLog[session['game']] = set([session['username']])

@socketio.on('undo_answer', namespace='/game_data')
def undo_answer(ans):
    if not is_valid_user():
        disconnect()
        return

    if ans == 'no':
        undo_tell('no')

    c = len(filter(lambda user: user['game'] == session['game'], app.users.values()))
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
