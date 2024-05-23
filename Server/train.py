# Load CSV file containing the database into Python
import pandas as pd
import torch
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer
from torch.utils.data import DataLoader, TensorDataset
import torch.nn as nn

def retrain(name):
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Load the CSV file into Python
    print('Loading the dataset...')

    dataset = pd.read_csv(name)

    print('Dataset Loaded Successfully!')

    print(dataset.head())

    # Encode the 'type' column into numerical format
    label_encoder = LabelEncoder()
    dataset['type'] = label_encoder.fit_transform(dataset['type'])

    # Split the dataset into features (URLs) and labels (types)
    X = dataset['url']
    y = dataset['type']

    # Initialize BERT tokenizer
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

    # Tokenize the URLs
    X_tokenized = []

    print("Tokenizing URLs...")

    for url in X:
        # Remove the URL prefix at the beginning of each URL (http:// or https://) and the first www. occurrence
        url = url.split('://')[-1].split('www.')[-1]
        #print(url)
        tokens_dict = tokenizer.encode_plus(url, add_special_tokens=True, truncation=True, padding='max_length', max_length=512, return_tensors='pt')
        input_ids = tokens_dict['input_ids']
        X_tokenized.append(input_ids)

    print("Tokenization complete!")

    # Convert the padded sequences and labels into PyTorch tensors
    X_tensor = torch.cat(X_tokenized, dim=0)
    y_tensor = torch.tensor(y.values, dtype=torch.long)

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X_tensor, y_tensor, test_size=0.4, random_state=42)

    print("X_train shape:", X_train.shape)
    print("X_test shape:", X_test.shape)
    print("y_train shape:", y_train.shape)
    print("y_test shape:", y_test.shape)

    # Create a TensorDataset
    train_dataset = TensorDataset(X_train, y_train)

    # Create a DataLoader
    batch_size = 64  
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    class URLClassifier(nn.Module):
        def __init__(self, vocab_size, embedding_dim, hidden_dim, num_classes):
            super(URLClassifier, self).__init__()
            self.embedding = nn.Embedding(vocab_size, embedding_dim)
            self.conv1 = nn.Conv1d(embedding_dim, hidden_dim, kernel_size=3, padding=1)
            self.pool = nn.MaxPool1d(kernel_size=2, stride=2)
            self.fc1 = nn.Linear(hidden_dim * 256, hidden_dim)  # Adjusted input size for 512 tokens
            self.fc2 = nn.Linear(hidden_dim, num_classes)
            self.dropout = nn.Dropout(0.5)
            self.relu = nn.ReLU()

        def forward(self, x):
            embedded = self.embedding(x)
            embedded = embedded.permute(0, 2, 1)  # Reshape for Conv1d
            conv_out = self.conv1(embedded)
            conv_out = self.relu(conv_out)
            pooled = self.pool(conv_out)
            pooled = pooled.view(pooled.size(0), -1)
            pooled = self.dropout(pooled)
            output = self.fc1(pooled)
            output = self.relu(output)
            output = self.fc2(output)
            return output    

    # Define hyperparameters
    vocab_size = len(tokenizer)  # Size of the vocabulary
    embedding_dim = 128  # Dimension of the embedding vector
    hidden_dim = 64  # Number of output channels for the convolutional layer
    num_classes = len(label_encoder.classes_)  # Number of classes
    learning_rate = 0.001
    num_epochs = 10

    # Create an instance of the URLClassifier model
    model = URLClassifier(vocab_size, embedding_dim, hidden_dim, num_classes).to(device)
    
    # Device configuration
    # Check if a GPU is available and move the model to the GPU
    if device.type == 'cuda':
        print('Model stays on GPU...')
    else:
        print('Moving model to CPU...')
        model = model.cpu()
        print('Moving data to CPU...')
        X_train = X_train.cpu()
        y_train = y_train.cpu()
        X_test = X_test.cpu()
        y_test = y_test.cpu()
        print('Data moved to CPU!')

    # Define loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    print('Start training...')

    # Training loop
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        correct = 0
        total = 0

        for inputs, labels in train_loader:  
            inputs, labels = inputs.to(device), labels.to(device)

            # Forward pass
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            # Backward pass and optimization
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            # Compute training accuracy
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

            total_loss += loss.item()

        # Print training statistics
        avg_loss = total_loss / len(train_loader)
        train_accuracy = correct / total

        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {avg_loss:.4f}, Accuracy: {train_accuracy:.4f}')

    print('Training completed!')

    # Save the model
    torch.save(model.state_dict(), 'url_classifier.pth')
    
    return True