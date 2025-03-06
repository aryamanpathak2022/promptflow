import firebase_admin
from firebase_admin import credentials, storage
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    cred = credentials.Certificate("/app/langchain/prompt-flow-d8fdf-firebase-adminsdk-t15vf-9742ab55d5.json")
    firebase_admin.initialize_app(cred, {'storageBucket': 'prompt-flow-d8fdf.appspot.com'})

# Function to upload a single file to Firebase Storage
def upload_zip_to_firebase(local_file_path):
    initialize_firebase()
    firebase_storage_path="uploads/my_folder"
    try:
        # Get a reference to the storage bucket
        bucket = storage.bucket()

        # Create a blob (the file object in Firebase Storage)
        blob = bucket.blob(firebase_storage_path)
        
        # Upload the file to the blob
        blob.upload_from_filename(local_file_path)

        # Make the file publicly accessible (optional)
        blob.make_public()
        
        # Print the public URL (if made public)
        print(f"File uploaded successfully: {blob.public_url}")

    except Exception as e:
        print(f"Error uploading file: {e}")

if __name__ == "__main__":
    # Local path of the file to upload
    local_file_path = '/path/to/your/file.txt'  # Update with the path to your file

    # Path in Firebase Storage (where you want to upload)
    firebase_storage_path = 'uploads/my_file.txt'  # Update with your desired storage path

    # Upload the file
    upload_file_to_firebase(local_file_path, firebase_storage_path)
