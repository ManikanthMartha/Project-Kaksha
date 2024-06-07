from flask import Flask, request, jsonify
import cv2
import numpy as np
from sign_land_det import process_frame
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    data_aux = data['data']
    
    prediction = process_frame(data_aux)
    
    if prediction:
        return jsonify({'translation': prediction})
    else:
        return jsonify({'translation': 'No hand detected'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8000)
