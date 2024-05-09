from flask import Flask, request, jsonify
from transformers import BertTokenizer
import torch

app = Flask(__name__)

# Load the trained PyTorch model
model = torch.load('../Training/url_classifier.pth')
model.eval()

# Define a route to receive URL requests
@app.route('/analyze_url', methods=['POST'])
def analyze_url():
    # Get the URL from the request
    url = request.json.get('url')
    
    # Preprocess the URL via BERT tokenization
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    # Convert the URL to a list of tokens
    tokens = tokenizer.tokenize(url)

    # Perform inference using the model
    with torch.no_grad():
        # Pass the preprocessed URL through the model
        # result = model(preprocessed_url)
        # For illustration purposes, assume the result is a class label (0, 1, 2, 3)
        result = torch.randint(0, 4, (1,))
    
    # Map the class label to a human-readable prediction
    # For example, 0: 'benign', 1: 'phishing', etc.
    prediction = ['benign', 'phishing', 'defacement', 'malware'][result.item()]
    
    # Return the prediction as JSON response
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
