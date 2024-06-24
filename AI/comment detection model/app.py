from flask import Flask, request, jsonify
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import model_from_json
import pickle
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

script_dir = os.path.dirname(os.path.realpath(__file__))

with open(os.path.join(script_dir, "2.json"), "r") as json_file:
    loaded_model_json = json_file.read()
loaded_model = model_from_json(loaded_model_json)


with open(os.path.join(script_dir, "tokenizer.pickle"), 'rb') as handle:
    tokenizer = pickle.load(handle)


loaded_model.load_weights(os.path.join(script_dir, "3.h5"))


class_names = ["Toxic", "Severe Toxic", "Obscene", "Threat", "Insult", "Identity Hate"]

def predict_comment(comment):
    
    tokenized_text = tokenizer.texts_to_sequences([comment])
    maxlen = 200
    padded_text = pad_sequences(tokenized_text, maxlen=maxlen)
    
    
    predictions = loaded_model.predict(padded_text)
    percentage_predictions = predictions * 100

    
    highest_percentage = 0
    highest_class = None
    for i, percentage in enumerate(percentage_predictions[0]):
        if percentage > 50 and percentage > highest_percentage:
            highest_percentage = percentage
            highest_class = class_names[i]
    
    return highest_class if highest_class else "acceptable"

@app.route('/predict', methods=['POST'])
def predict():
    
    data = request.get_json()
    if not data or 'comment' not in data:
        return jsonify({"error": "No comment provided"}), 400

    comment = data['comment']
    result = predict_comment(comment)
    if result == "acceptable":
        return jsonify({"message": "accepted"})
    else:
        return jsonify({"message": "rejected"})

if __name__ == '__main__':
    app.run(debug=True , port=5002)

