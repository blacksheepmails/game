from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

@app.route('/game')
def root():
    return app.send_static_file('game.html')

@app.route('/get_move', methods=['GET'])
def get_move():
    return jsonify(questions) 

@app.route('/send_move', methods=['POST'])
def send_move():
    return ''

if __name__ == "__main__":
    app.run(debug=True)
