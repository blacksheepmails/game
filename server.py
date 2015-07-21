from flask import Flask, request, jsonify, session, redirect, url_for, escape
app = Flask(__name__)

inCount = {}
log = {}

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
        session['game'] = request.form['gamename']
        session['player'] = request.form['player']
        session['outCount'] = 0

        if session['game'] not in log:
            log[session['game']] = []

        return redirect(url_for('index'))

    return app.send.send_static_file('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == "__main__":
    app.run(debug=True)
