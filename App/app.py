from flask import Flask, request, jsonify
from transformers import BertTokenizer
import torch
import os
import joblib
from model import load_model
from sklearn.feature_extraction.text import TfidfVectorizer


app = Flask(__name__)

# Load the pre-trained BERT tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Load the trained PyTorch model
# Get the path of the current directory
current_directory = os.path.dirname(os.path.abspath(__file__))

print('Loading model...')

# Construct the path to the trained model file and load it
model_path = os.path.join(current_directory, 'url_classifier.pth')
model = load_model(model_path)

print('CNN loaded successfully!')

# Set the model to evaluation mode
model.eval()

print('CNN is in evaluation mode!')

# Load Logistic Regression model
#logistic_model_path = os.path.join(current_directory, 'logistic_regression_model.pkl')
#logistic_model = joblib.load(logistic_model_path)
#print(logistic_model)
#print('Logistic Regression model loaded successfully!')

# Define a route to receive URL requests
@app.route('/analyze_url', methods=['POST'])
def analyze_url():
    # Get the URL from the request
    url = request.json.get('url')
    
    # Preprocess the URL by removing leading/trailing whitespaces and converting it to lowercase, and remove the protocol
    url = url.strip().lower().replace('http://', '').replace('https://', '')

    print(f'Analyzing URL: {url}')

    # Convert the URL to a feature vector using the TF-IDF vectorizer with 590757 features
    #vectorizer = TfidfVectorizer()
    #vectorizer.fit([url])
    #url_vector = vectorizer.transform([url])

    # Perform inference using the logistic regression model
    #logistic_prediction = logistic_model.predict(url_vector)[0]

    # Perform inference using the CNN model
    # Preprocess the URL and tokenize it using the BERT tokenizer not modified
    tokens = tokenizer.encode_plus(url, add_special_tokens=True, truncation=True, padding='max_length', return_tensors='pt')
    
    print('URL tokenized successfully!')

    # Perform inference using the model
    with torch.no_grad():
        outputs = model(tokens['input_ids'])
    
    # Get the predicted class label
    _, predicted = torch.max(outputs, 1)
    
    # Map the class label to a human-readable prediction
    class_labels = ['benign', 'phishing', 'defacement', 'malware']
    prediction = class_labels[predicted.item()]

    print(f'Prediction: {prediction}')
    
    # Return the prediction as JSON response
    return jsonify({'prediction': prediction, }) #'logistic_prediction': logistic_prediction})

if __name__ == '__main__':
    app.run(debug=True)
