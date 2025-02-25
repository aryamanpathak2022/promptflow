# Import specific functions from utils.py
from run_command import run_command
from update_file import update_file

# Example: Run a terminal command
output = run_command('ls')  # or 'dir' on Windows
print(output)

# Example: Update a file
file_path = '/path/to/your/file.py'
code = """
def hello_world():
    print("Hello, World!")
"""
result = update_file(file_path, code, mode='w')
print(result)
