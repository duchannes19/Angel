# General Imports
from flask import Flask, request, jsonify
from transformers import BertTokenizer
import torch
import os
import re

# Logistic Regression model imports
#from sklearn.feature_extraction.text import TfidfVectorizer
#import joblib

# CNN model import
from model import load_model

# Url Lib import for scanning
from urllib.request import urlretrieve

# Import the scanner main function
from Scanner.scanner import scan_malware

# Color class for printing
class Bcolors:
    Black = '\033[30m'
    Red = '\033[31m'
    Green = '\033[32m'
    Yellow = '\033[33m'
    Blue = '\033[34m'
    Magenta = '\033[35m'
    Cyan = '\033[36m'
    White = '\033[37m'
    Endc = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

app = Flask("Angel Server")

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

    print(f'Analyzing URL: {url}')

    # Convert the URL to a feature vector using the TF-IDF vectorizer with 590757 features
    #vectorizer = TfidfVectorizer()
    #vectorizer.fit([url])
    #url_vector = vectorizer.transform([url])

    # Perform inference using the logistic regression model
    #logistic_prediction = logistic_model.predict(url_vector)[0]

    # Remove the 'http://' or 'https://' and www. from the URL
    url = re.sub(r'https?://(www\.)?', '', url)

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
    
    # Default malware result
    malware_result = 'No malware scanned'
    
    # Find last dot after the last slash
    last_slash = url.rfind('/')
    
    # Find the file extension using regex    
    regex = re.search(r'\.[a-zA-Z0-9]+', url[last_slash:])
    
    regex_result = regex.group(0) if regex is not None else None
    
    print("Regex result: ", regex_result)
    
    # Check if the URL has a file extension
    if len(url) > last_slash + 1 and regex_result is not None:
        # Get the file extension
        file_extension = url.split('.')[-1]
        # Download the URL content and save it inside the 'Scanner' directory
        download_location = os.path.join(current_directory, 'Scanner', 'malicious_file.' + file_extension)
        try:
            print('Downloading file for scanning...')
            urlretrieve(url, download_location)
            # Scan the downloaded file for malware and wait for the result
            malware_result = scan_malware(download_location)
            # Remove the downloaded file
            os.remove(download_location)
            print('- File Removed')
        except Exception as e:
            print(f'Error downloading the file: {e}')
    
    # Print the results
    if(prediction != 'benign'):
        print(f'Prediction: {Bcolors.Red} {prediction} {Bcolors.Endc}')
    else:
        print(f'Prediction: {Bcolors.Green} {prediction} {Bcolors.Endc}')

    if malware_result == True:
        print(f'Malware Result: {Bcolors.Red} {malware_result} {Bcolors.Endc}')
    elif type(malware_result) == str:
        print(f'Malware Result: {Bcolors.Yellow} {malware_result} {Bcolors.Endc}')
    else:
        print(f'Malware Result: {Bcolors.Green} {malware_result} {Bcolors.Endc}')
    
    # Return the prediction as JSON response
    return jsonify({'prediction': prediction, 'ismalware' : malware_result}) #'logistic_prediction': logistic_prediction})

if __name__ == '__main__':
    app.run()
