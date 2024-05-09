from flask import Flask, request, jsonify
from transformers import BertTokenizer
import torch
import os
from model import load_model

app = Flask(__name__)

# Load the pre-trained BERT tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Load the trained PyTorch model
# Get the path of the current directory
current_directory = os.path.dirname(os.path.abspath(__file__))

print('Loading model...')
# Construct the path to the trained model file
model_path = os.path.join(current_directory, 'url_classifier.pth')
model = load_model(model_path)
print('Model loaded successfully!')
model.eval()

# Define a route to receive URL requests
@app.route('/analyze_url', methods=['POST'])
def analyze_url():
    # Get the URL from the request
    url = request.json.get('url')
    
    # Preprocess the URL and tokenize it using the BERT tokenizer
    tokens = tokenizer.encode_plus(url, add_special_tokens=True, max_length=512, truncation=True, padding='max_length', return_tensors='pt')
    
    # Perform inference using the model
    with torch.no_grad():
        outputs = model(tokens['input_ids'])
    
    # Get the predicted class label
    _, predicted = torch.max(outputs, 1)
    
    # Map the class label to a human-readable prediction
    class_labels = ['benign', 'phishing', 'defacement', 'malware']
    prediction = class_labels[predicted.item()]
    
    # Return the prediction as JSON response
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
