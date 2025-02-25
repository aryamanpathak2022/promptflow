from flask import Flask, redirect, request, session, url_for, jsonify
from github import Github
import git
import os
import requests
import sqlite3

# GitHub OAuth credentials
CLIENT_ID = 'Ov23liT7U9majuZ1XYCf'
CLIENT_SECRET = '1d16fb967c912f0dcff047cbf41ac8555fcebb3d'
GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
GITHUB_API_URL = 'https://api.github.com/user'

# Access Token (replace with your token)
ACCESS_TOKEN = 'your_access_token_here'

# Flask setup
app = Flask(__name__)
app.secret_key = 'prompt_flow'

# Initialize the database
def init_db():
    conn = sqlite3.connect('repo_counter.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS counters (
            id INTEGER PRIMARY KEY,
            counter INTEGER NOT NULL
        )
    ''')
    cursor.execute('INSERT OR IGNORE INTO counters (id, counter) VALUES (1, 0)')
    conn.commit()
    conn.close()

# Get the current counter
def get_repo_counter():
    conn = sqlite3.connect('repo_counter.db')
    cursor = conn.cursor()
    cursor.execute('SELECT counter FROM counters WHERE id = 1')
    counter = cursor.fetchone()[0]
    conn.close()
    return counter

# Update the counter
def update_repo_counter(new_counter):
    conn = sqlite3.connect('repo_counter.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE counters SET counter = ? WHERE id = 1', (new_counter,))
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Load the counter at startup
repo_counter = get_repo_counter()

# Route to initiate GitHub OAuth
@app.route('/')
def home():
    github_auth_url = f"{GITHUB_AUTH_URL}?client_id={CLIENT_ID}&scope=repo"
    return f'<h1>Login with GitHub</h1><a href="{github_auth_url}">Click here to authenticate</a>'

# GitHub OAuth callback route to get the access token
@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_response = requests.post(
        GITHUB_TOKEN_URL,
        headers={'Accept': 'application/json'},
        data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code
        }
    )
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    session['access_token'] = access_token
    return redirect(url_for('create_repo'))

# Create repository after authentication
@app.route('/create_repo')
def create_repo():
    global repo_counter
    access_token = session.get('access_token', ACCESS_TOKEN)

    if not access_token:
        return jsonify({"error": "Access token is missing."}), 403

    g = Github(access_token)
    user = g.get_user()
    repo_name = f'prompt-flow-{repo_counter}'

    # Increment the counter and update it
    repo_counter += 1
    update_repo_counter(repo_counter)

    try:
        repo = user.get_repo(repo_name)
        return jsonify({"message": f'Repository "{repo_name}" already exists.', "repo_url": repo.html_url})
    except:
        try:
            repo = user.create_repo(repo_name)
            return jsonify({"message": f'Repository {repo_name} created successfully!', "repo_url": repo.html_url})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# Upload files to the created repository
@app.route('/upload_file/<repo_name>', methods=['GET', 'POST'])
def upload_file(repo_name):
    access_token = session.get('access_token', ACCESS_TOKEN)

    if not access_token:
        return redirect(url_for('home'))

    if request.method == 'POST':
        upload_path = request.form.get('upload_path')
        file = request.files['file']
        if file:
            if not os.path.exists(upload_path):
                os.makedirs(upload_path)

            file_path = os.path.join(upload_path, file.filename)
            file.save(file_path)

            g = Github(access_token)
            user = g.get_user()
            
            try:
                repo = user.get_repo(repo_name)
            except Exception as e:
                return f"Error accessing repository: {str(e)}"

            if not os.path.exists(upload_path):
                repo_local = git.Repo.clone_from(repo.clone_url, upload_path)
            else:
                try:
                    repo_local = git.Repo(upload_path)
                except Exception as e:
                    return f"Error accessing existing repository: {str(e)}"

            try:
                repo_local.git.add(file_path)
                repo_local.index.commit(f"Add {file.filename} via Flask app")

                origin_url = repo.clone_url.replace('https://', f'https://{access_token}@')
                repo_local.git.remote('set-url', 'origin', origin_url)
                origin = repo_local.remote(name='origin')
                origin.push()

                return f"File '{file.filename}' added and pushed to {repo_name}!"
            except Exception as e:
                return f"Error during file operations: {str(e)}"

    return '''
    <h1>Upload a file</h1>
    <form method="post" enctype="multipart/form-data">
        <input type="text" name="upload_path" placeholder="Enter upload directory" required>
        <input type="file" name="file" required>
        <input type="submit" value="Upload">
    </form>
    '''

@app.route('/api/start', methods=['POST'])
def start_process():
    code = request.json.get('code')  # Expecting the OAuth code in the request
    if not code:
        return jsonify({"error": "No code provided."}), 400
    
    # Exchange code for access token
    token_response = requests.post(
        GITHUB_TOKEN_URL,
        headers={'Accept': 'application/json'},
        data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code
        }
    )
    
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    if not access_token:
        return jsonify({"error": "Could not retrieve access token."}), 400
    
    session['access_token'] = access_token
    return create_repo()  # Call the create_repo function directly

# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True, port=5001)
