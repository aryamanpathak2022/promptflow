import sqlite3

# Function to initialize the database
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

# Function to get the current counter
def get_repo_counter():
    conn = sqlite3.connect('repo_counter.db')
    cursor = conn.cursor()
    cursor.execute('SELECT counter FROM counters WHERE id = 1')
    counter = cursor.fetchone()[0]
    conn.close()
    return counter

# Function to update the counter
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

# Update the counter in the create_repo function
@app.route('/create_repo')
def create_repo():
    global repo_counter
    access_token = session.get('access_token', ACCESS_TOKEN)

    if not access_token:
        return redirect(url_for('home'))

    g = Github(access_token)
    user = g.get_user()
    repo_name = f'prompt-flow-{repo_counter}'
    
    # Increment the counter and update it
    repo_counter += 1
    update_repo_counter(repo_counter)

    try:
        repo = user.get_repo(repo_name)
        return f'Repository "{repo_name}" already exists. <a href="/upload_file/{repo_name}">Upload Files</a>'
    except:
        try:
            repo = user.create_repo(repo_name)
            return f'Repository {repo_name} created successfully! <a href="/upload_file/{repo_name}">Upload Files</a>'
        except Exception as e:
            return f"Error creating repository: {str(e)}"
