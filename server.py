from flask import Flask, request, jsonify, session, redirect, url_for, escape
app = Flask(__name__)

inCount = {}
log = {}
users = []

@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/game')
def root():
    if 'username' in session:
        return app.send_static_file('game.html')
    return 'You are not logged in'

@app.route('/get_move', methods=['GET'])
def get_click():

    if 'outCount' in session:
        if session['outCount'] < len(log[session['game']]) :
            click = log[session['game']][session['outCount']]
            session['outCount'] += 1
            return jsonify(click)
    return ''


@app.route('/users', methods=['GET'])
def logged_in_users():
    return jsonify({'users': users})

@app.route('/games', methods=['GET'])
def active_games():
    return jsonify({'games': list(log.keys())})

@app.route('/active', methods=['GET'])
def active_page():
    return app.send_static_file('views/active.html')

@app.route('/post_move', methods=['POST'])
def post_click():
    global log
    if 'username' in session:
        click = request.get_json()
        log[session['game']].append(click)
    return ''

@app.route('/')
def index():
    if 'username' in session:
        return 'Logged in as %s' % escape(session['username'])
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    global log
    if request.method == 'POST':
        session['username'] = request.form['username']
        users.append(session['username'])

        session['game'] = request.form['gamename']
        session['player'] = request.form['player']
        session['outCount'] = 0

        if session['game'] not in log:
            log[session['game']] = []

        return redirect(url_for('root'))

    return app.send_static_file('views/login.html')

@app.route('/logout')
def logout():
    if 'username' in session:
        users.remove(session['username'])
        session.pop('username', None)

    return redirect(url_for('index'))

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == "__main__":
    app.run(debug=True)
