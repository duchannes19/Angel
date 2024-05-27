# General Imports
from flask import Flask, request, jsonify
from transformers import BertTokenizer
import torch
import os
import re

# Logistic Regression model imports
#from sklearn.feature_extraction.text import TfidfVectorizer
#import joblib

# Import the database functions
from database import Database

# CNN model import
from model import load_model

# Url Lib import for scanning
from urllib.request import urlretrieve

# Import the scanner main function
from Scanner.scanner import scan_malware

# Import the retrain function
from train import retrain

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

print(f'{Bcolors.Yellow}Server loading...{Bcolors.Endc}')

# Construct the path to the trained model file and load it
model_path = os.path.join(current_directory, 'url_classifier.pth')
MODEL = load_model(model_path)

# Set the model to evaluation mode
MODEL.eval()

print(f'{Bcolors.Green}CNN loaded successfully and in Evaluation mode.{Bcolors.Endc}')

# Load Logistic Regression model
#logistic_model_path = os.path.join(current_directory, 'logistic_regression_model.pkl')
#logistic_model = joblib.load(logistic_model_path)
#print(logistic_model)
#print('Logistic Regression model loaded successfully!')

print(f'{Bcolors.Green}Server loaded successfully, waiting for requests.{Bcolors.Endc}')

print(f'{Bcolors.Yellow}Use CTRL+C to stop.{Bcolors.Endc}')

try:
    # Load the database
    db = Database('database.json')
except Exception as e:
    print(f'{Bcolors.Red}Error loading the database: {e}{Bcolors.Endc}')

print(f'{Bcolors.Green}Database loaded successfully!{Bcolors.Endc}')

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

    # Remove protocol at the beginning of the URL and www. if present
    url = re.sub(r'^https?:\/\/(www\.)?', '', url).strip()
    
    # Check if the URL exists in the database (whitelist)
    iswhitelisted = db.check_url(url)
    
    if iswhitelisted is not None:
        return jsonify({'prediction': 'benign', 'ismalware' : False})
    
    # Continue with the prediction
    
    print('URL preprocessed: ', url)

    # Perform inference using the CNN model
    # Preprocess the URL and tokenize it using the BERT tokenizer not modified
    tokens = tokenizer.encode_plus(url, add_special_tokens=True, truncation=True, padding='max_length', return_tensors='pt')
    
    print('URL tokenized successfully!')

    # Perform inference using the model
    with torch.no_grad():
        outputs = MODEL(tokens['input_ids'])
    
    # Get the predicted class label
    _, predicted = torch.max(outputs, 1)
    
    # Map the class label to a human-readable prediction
    class_labels = ['benign', 'malware']
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


@app.route('/add_to_whitelist', methods=['POST'])
def add_to_whitelist():
    url = request.json.get('url')
    is_malicious = False
    
    url = re.sub(r'^https?:\/\/(www\.)?', '', url).strip()
    
    print(f'Adding URL to whitelist: {url}')
    
    # Write the URL to the database
    db.write(url, is_malicious)
    
    return jsonify({'message': 'URL added to whitelist successfully!', 'success': True})

@app.route('/get_whitelist', methods=['GET'])
def get_whitelist():
    print(f'{Bcolors.Yellow}Getting whitelist...{Bcolors.Endc}')
    data = db.get_all()
    print(f'{Bcolors.Green}Whitelist retrieved successfully and sent!{Bcolors.Endc}')
    return jsonify(data)

# Retrain the CNN model using the new data from the database
@app.route('/retrain', methods=['POST'])
def train_again():
    
    # Get the data from the database as a CSV string
    print(f'{Bcolors.Yellow}Retraining the model...{Bcolors.Endc}')
    data = db.get_csv()
    
    # Check if the data is empty
    if len(data) == 0:
        return jsonify({'message': 'No new data to retrain the model!', 'success': False})
    
    # Check if there is at least 10 URLs in the database
    #if len(data.split('\n')) < 10:
    #    return jsonify({'message': 'Not enough data to retrain the model!', 'success': False})
    
    # Append the data to the dataset
    with open('main_dataset.csv', 'a') as file:
        file.write(data)
    
    try:
        train = retrain('main_dataset.csv')
        if(train):
            # Load the new model
            global MODEL
            MODEL = load_model(model_path)
            # Clear the database
            db.delete_all()
            
    except Exception as e:
        return jsonify({'message': f'Error retraining the model: {e}', 'success': False})
    
    print(f'{Bcolors.Green}Model retrained successfully!{Bcolors.Endc}')
    return jsonify({'message': 'Model retrained successfully!', 'success': True})
    
@app.route('/delete_whitelist', methods=['DELETE'])
def delete_whitelist():
    print(f'{Bcolors.Yellow}Deleting whitelist...{Bcolors.Endc}')
    db.delete_all()
    print(f'{Bcolors.Green}Whitelist deleted successfully!{Bcolors.Endc}')
    return jsonify({'message': 'Whitelist deleted successfully!', 'success': True})

if __name__ == '__main__':
    app.run()
