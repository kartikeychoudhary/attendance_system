import json
from flask import Flask, render_template, request, jsonify, make_response
from werkzeug import secure_filename

app = Flask(__name__)


@app.route('/video/upload', methods=['GET', 'POST'])
def video_file():
    if request.method == 'POST':
        # request.headers['Access-Control-Allow-Origin'] = '*'
        f = request.files['file']
        print(request)
        print(f.filename)
        f.save("files/videos/"+secure_filename(f.filename))
        # response = jsonify({"order_id": 123, "status": "shipped"})
        # response.headers.add("Access-Control-Allow-Origin", "*")
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response


@app.route('/attend/session', methods=['GET', 'POST'])
def attend_session():
    if request.method == 'POST':
        f = request.files['file']
        # print(request.content)
        f.save("files/attendance/"+secure_filename("test.png"))
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response


if __name__ == '__main__':
    app.run(debug=True)
