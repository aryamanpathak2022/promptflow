import subprocess

def run_command(command,cwd="frontend"):
    try:
        # Run the command using Bash
        result = subprocess.run(
            command,  # Use bash -c to run the command
            shell=True,              # Enable shell features
            check=True,              # Raise an error for non-zero exit codes
            stdout=subprocess.PIPE,  # Capture standard output
            stderr=subprocess.PIPE,  # Capture standard error
            text=True ,
            cwd=cwd,    # Automatically decode to str
            input='yes\n' * 10
        )
        print(f"Output: {result.stdout}")  # Output is already a string
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")         # Error is also a string

def run_command_create(command):
    try:
        # Run the command using Bash
        result = subprocess.run(
            command,  # Use bash -c to run the command
            shell=True,              # Enable shell features
            check=True,              # Raise an error for non-zero exit codes
            stdout=subprocess.PIPE,  # Capture standard output
            stderr=subprocess.PIPE,  # Capture standard error
            text=True ,
            # Automatically decode to str
            input='yes\n' * 10
        )
        print(f"Output: {result.stdout}")  # Output is already a string
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")         # Error is also a string


# Example usage
run_command("echo 'Hello from Bash!'")
