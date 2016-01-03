import redis
import ast
from flask import Flask
from flask import jsonify, redirect, url_for, escape
from flask import request,  session 
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect

app = Flask(__name__)
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


@socketio.on('connect', namespace='/game_data')
def handle_connect():
    if 'username' not in session:
        return redirect(url_for('login'))

    app.users[session['username']] = {
        'game': session['game'],
        'player': session['player'],
        'setup': session['setup'],
        'stateMachine': session['stateMachine']
    }
    join_room(session['game'])
    for move_bytes_literal in db.lrange(session['game'], 0, -1):
        move = ast.literal_eval(move_bytes_literal.decode("utf-8"))
        emit('server_to_client_move', move)
        if 'info' in move:
            emit('picked_piece', move['info'])

@socketio.on('client_to_server_move', namespace='/game_data')
def received_move(move):
    print('moved')
    emit('server_to_client_move', move, room = session['game'])
    print(str(move))
    db.rpush(session['game'], str(move))

@socketio.on('picking_piece', namespace='/game_data')
def picking_piece(stuff):
    print('picking_piece')
    emit('picking_piece', session['username'], room = session['game'])

@socketio.on('picked_piece', namespace='/game_data')
def picked_piece(piece):
    print('picked_piece')
    move = ast.literal_eval(db.rpop(session['game']).decode("utf-8"))
    move['info'] = piece;
    db.rpush(session['game'], str(move))
    emit('picked_piece', piece, room = session['game'])

if __name__ == '__main__':
    socketio.run(app, debug=True)
