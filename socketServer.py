import redis
import ast
from flask import Flask
from flask import jsonify, redirect, url_for, escape
from flask import request,  session 
from flask_socketio import SocketIO, emit, rooms, join_room, leave_room, disconnect

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

socketio = SocketIO(app, engineio_logger=True)
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

# @app.route('/logout')
# def logout():
#     if 'username' in session:
#         if session['username'] in app.users:
#             del app.users[session['username']]
#         session.pop('username', None)
#     return redirect(url_for('login'))


# def is_valid_user():
#     # if 'username' not in session:
#     #     return False

#     return session['username'] in app.users

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
    print('ROOMS: ' + str(rooms()))
    for move_bytes_literal in db.lrange(session['game'], 0, -1):
        move = ast.literal_eval(move_bytes_literal.decode("utf-8"))
        emit('server_to_client_move', move)
        if 'info' in move:
            emit('picked_piece', move['info'])

@socketio.on('disconnect', namespace='/game_data') #maaybe delet
def handle_disconnect():
    if 'username' in session and session['username'] in app.users:
        del app.users[session['username']]
    print(str(rooms()) + ' disconnected')

@socketio.on('client_to_server_move', namespace='/game_data')
def received_move(move):
    # if session['game'] in app.undoLog:
    #     undo_tell('no')
    emit('server_to_client_move', move, room = session['game'], namespace = '/game_data')
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

@socketio.on('undo_ask', namespace='/game_data')
def undo_ask(stuff):
    print(session['username'] + ' asks for undo')
    emit('undo_ask_from_server', session['username'], room = session['game'], namespace='/game_data')
    # app.undoLog[session['game']] = set([session['username']])
    app.undoLog[session['game']] = set([]) ##starts as empty set. user who triggers undo has to confirm
    print(session['username'] + ' end asking undo')


@socketio.on('undo_answer', namespace='/game_data')
def undo_answer(ans):
    print(session['username'] + ' undo response')
    if ans == 'no':
        undo_tell('no')

    # c = len(list(filter(lambda user: user['game'] == session['game'], app.users.values())))
    if session['game'] in app.undoLog:
        print(session['username'] + ' hereA')
        app.undoLog[session['game']].add(session['username'])
        # if len(app.undoLog[session['game']]) <= c:
            # print("eeOOOOOOOOOOOOOOOOO\n\n\n\n\n\n\n")
            # undo_tell('yes')
        print(list(filter(lambda name: app.users[name]['game'] == session['game'], app.users)))
        for x in filter(lambda name: app.users[name]['game'] == session['game'], app.users):
            print(session['username'] + ' hereB')
            if x not in app.undoLog[session['game']]:
                print(session['username'] + ' hereC')
                return
        print(session['username'] + ' hereD')
        undo_tell('yes')

def undo_tell(ans):
    print('before undotell ' + ans + ' :  ' + str(app.users.keys()))
    emit('undo_answer_from_server', ans, room = session['game'], namespace='/game_data')
    print(session['username'] + ' hereE')
    del app.undoLog[session['game']]
    db.rpop(session['game'])
    print('after undotell: ' + str(app.users.keys()))


if __name__ == '__main__':
    socketio.run(app, debug=True)
