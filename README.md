<p align="center">
    <img src="angel.png" alt="Image" width="30%" height="30%">
</p>


# ANGELs (Automated Network Guardian and Enhanced Local Security)

## Introduction
The following project is a tool used to analyze url requests during navigation and evaluate the security of the website based on
predictions with a Convolutional Neural Network. The tool is implemented as a Chrome extension and a Flask server. The extension
intercepts requests made by the browser and sends them to the server for analysis. The server uses a model trained by us with a modified dataset to predict the security of the website and sends the result back to the extension. The extension then displays the result to the user.

## Setup For Local Development

1. **Installing Anaconda:**
   - Visit the Anaconda website at https://www.anaconda.com/download/success.
   - Download the Anaconda installer for your operating system (Windows, macOS, or Linux).
   - Run the installer and follow the on-screen instructions.
   - Make sure to select the option to add Anaconda to your system's PATH during the installation process.

2. **Creating a 'ml' Environment:**
   - Open a terminal or command prompt. On Windows search for 'Anaconda Terminal' or 'Anaconda Powershell Terminal', I think on Linux also.
   - Type the following command to create a new Anaconda environment named 'ml':
     ```
     conda create --name ml
     ```

3. **Activating the 'ml' Environment:**
   - Activate the 'ml' environment by running the following command:
     ```
     conda activate ml
     ```

4. **Installing Requirements.txt:**
   - Navigate to the directory where the requirements.txt file is located.
   - Install the requirements using the following command:
     ```
     pip install -r requirements.txt
     ```
   - This may require administrative rights.

5. **Build Extension**
   - Navigate to the extension directory.
   - Install dependencies with:
     ```
     npm i
     ```
   - Build the extension and load it in chrome://extensions:
     ```bash
     npm run build
     ```
   - Load the extension in Chrome by enabling developer mode and loading the extension from the build folder.

6. **Running the Angel Server:**
   - Run the Flask server using the following command:
     ```
     waitress-serve --host 127.0.0.1 --port 5000 app:app
     ```

7. **Easy Run:**
   - Run the following command in the root directory to start the server or install dependencies instead:
     ```
     python start.py
     ```

## Docker Setup

1. **Building the Docker Image:**
   - Navigate to the Server directory of the project.
   - Build the Docker image using the following command:
     ```
     docker build -t angel .
     ```
   - Run the Docker container using the following command:
     ```
     docker run -p 5000:5000 -e PYTHONUNBUFFERED=1 -d angel
     ```

### Credits

- [Malware Scan](https://github.com/password123456/malwarescanner/tree/main)
- [Url Dataset](https://www.kaggle.com/datasets/sid321axn/malicious-urls-dataset/data)  