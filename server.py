from flask import Flask, request, jsonify
app = Flask(__name__)

click = []
inCount = 0
outCount = 0

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

@app.route('/game')
def root():
    return app.send_static_file('game.html')

@app.route('/get_click', methods=['GET'])
def get_click():
	global outCount

	if outCount < inCount :
		outCount += 1
		print('click is ', click)

		return jsonify(click)
	return ''

@app.route('/post_click', methods=['POST'])
def post_click():
	global inCount
	global click

	click = request.get_json()
	print('recieved', click)
	inCount += 2
	return ''

if __name__ == "__main__":
    app.run(debug=True)
