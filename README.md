<p align="center">
    <img src="angel.png" alt="Image" width="50%" height="50%">
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
   - Navigate to the directory where your requirements.txt file is located.
   - Install the requirements using the following command:
     ```bash
     pip install -r requirements.txt
     ```
   - This may require administrative rights.

## On the train.ipynb

1. Select the kernel 'ml' from the pop up window in Visual Studio Code.