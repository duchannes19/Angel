<p align="center">
    <img src="angel.png" alt="Image" width="30%" height="30%">
</p>

# ANGELs (Automated Network Guardian and Enhanced Local Security)

## Setup

1. **Installing Anaconda:**
   - Visit the Anaconda website at https://www.anaconda.com/download/success.
   - Download the Anaconda installer for your operating system (Windows, macOS, or Linux).
   - Run the installer and follow the on-screen instructions.
   - Make sure to select the option to add Anaconda to your system's PATH during the installation process.

2. **Creating a 'ml' Environment:**
   - Open a terminal or command prompt. On Windows search for 'Anaconda Terminal' or 'Anaconda Powershell Terminal', I think on Linux also.
   - Type the following command to create a new Anaconda environment named 'ml':
     ```bash
     conda create --name ml
     ```

3. **Activating the 'ml' Environment:**
   - Activate the 'ml' environment by running the following command:
     ```bash
     conda activate ml
     ```

4. **Installing Requirements.txt:**
   - Navigate to the directory where the requirements.txt file is located.
   - Install the requirements using the following command:
     ```bash
     pip install -r requirements.txt
     ```
   - This may require administrative rights.

## For Training on Juppyter NB

1. Select the kernel 'ml' from the pop up window in Visual Studio Code when using CNN.ipynb.

## Flask Server

1. Run with waitress (production server):

```
waitress-serve --host 127.0.0.1 --port 5000 app:app
```

2. Remember to use the correct environment.

## Extension

1. The extension is a Vite React application that uses background to communicate with the Server and a contentscript to inject stuff inside the DOM.

2. Install dependencies with:

```
npm i
```

2. Build the extension and load it in chrome://extensions:

```
npm run build
```

## To Do

1. Whitelist implementation (pysondb).

2. More interaction with the server from the Extension.

3. Dockerize the server.

4. More...