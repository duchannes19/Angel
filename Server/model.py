import torch
import torch.nn as nn
from transformers import BertTokenizer
from sklearn.preprocessing import LabelEncoder

class URLClassifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, num_classes):
        super(URLClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.conv1 = nn.Conv1d(embedding_dim, hidden_dim, kernel_size=3, padding=1)
        self.pool = nn.MaxPool1d(kernel_size=2, stride=2)
        self.fc1 = nn.Linear(hidden_dim * 256, hidden_dim) 
        self.fc2 = nn.Linear(hidden_dim, num_classes)
        self.dropout = nn.Dropout(0.5)
        self.relu = nn.ReLU()

    def forward(self, x):
        embedded = self.embedding(x)
        embedded = embedded.permute(0, 2, 1)
        conv_out = self.conv1(embedded)
        conv_out = self.relu(conv_out)
        pooled = self.pool(conv_out)
        pooled = pooled.view(pooled.size(0), -1)
        pooled = self.dropout(pooled)
        output = self.fc1(pooled)
        output = self.relu(output)
        output = self.fc2(output)
        return output

def load_model(model_path):
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Load the model
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')  # Initialize the BERT tokenizer
    vocab_size = len(tokenizer)  # Size of the vocabulary
    embedding_dim = 128  # Dimensionality of token embeddings
    hidden_dim = 64  # Number of output channels for the convolutional layer
    label_encoder = LabelEncoder()  # Initialize the label encoder
    label_encoder.classes_ = ['benign', 'malware']  # Load the classes
    num_classes = len(label_encoder.classes_)  # Number of classes
    model = URLClassifier(vocab_size, embedding_dim, hidden_dim, num_classes)  # Initialize the model
    
    # Check if a GPU is available and move the model to the GPU
    if device.type == 'cuda':
        print('Moving model to GPU...')
        model.load_state_dict(torch.load(model_path))
    else:
        print('Moving model to CPU...')
        model = model.cpu()
        model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    return model
