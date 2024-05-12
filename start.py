import os

# Get the path of the current directory
current_directory = os.path.dirname(os.path.abspath(__file__))

# Load ans file to display the menu
ans = open(f"{current_directory}\\angel.txt", "r")
print(ans.read())
print("Welcome to the Angel Server!\n")

def display_menu():
    print("Select a service to start:")
    print("1. Angel Server")
    print("2. Install dependencies")
    print("3. Exit")

def execute_service(service_number):
    if service_number == 1:
        # Start the Angel Server with anaconda environment
        print("\nStarting the Angel Server...\n")
        os.system(f"python {current_directory}\\Server\\app.py")
    elif service_number == 2:
        # Install dependencies
        print("\nInstalling dependencies...\n")
        os.system(f"pip install -r {current_directory}\\requirements.txt")
    else:
        print("\nExiting...\n")
        exit()

def main():
    while True:
        display_menu()
        choice = input("Enter your choice: ")
        try:
            choice = int(choice)
            if choice < 1 or choice > 3:
                print("Invalid choice. Please try again.")
                continue
            execute_service(choice)
        except ValueError:
            print("Invalid choice. Please enter a number.")

if __name__ == "__main__":
    main()