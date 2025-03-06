def update_file(file_address, code, mode='w'):
    """
    Updates a file at the given address with the provided code.
    
    Args:
        file_address (str): The path of the file to update.
        code (str): The code (or text) to write into the file.
        mode (str): Mode to open the file. Use 'w' to overwrite or 'a' to append. Default is 'w'.
        
    Returns:
        str: Success message or error message.
    """
    try:
        with open(file_address, mode) as file:
            file.write(code)
        return f"File '{file_address}' updated successfully."
    except FileNotFoundError:
        return f"Error: File '{file_address}' not found."
    except Exception as e:
        return f"Error: {str(e)}"
