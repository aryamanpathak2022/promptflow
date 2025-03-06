import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from fastapi import FastAPI
from langserve import add_routes

# Load environment variables
load_dotenv()

# Initialize the Google Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# Initialize message history
chat_history = ChatMessageHistory()

# The template for generating the initial response
generic_template = '''You are an expert software developer. Provide the **backend setup** for an application. Use the following frontend setup for context.

**Frontend File Structure Setup**:

terminal: mkdir my-frontend-app  
terminal: cd my-frontend-app  
terminal: npm init -y  

terminal: npm install react react-dom react-router-dom  
terminal: mkdir src  
terminal: touch src/index.js  
terminal: touch src/App.js  
terminal: touch src/pages/Home.js  
terminal: touch src/pages/About.js  
terminal: touch src/pages/Contact.js  
terminal: mkdir components  
terminal: touch components/Navbar.js  
terminal: touch components/Footer.js  

Ensure the following for the **backend setup**:
1. **Terminal commands** should start with "terminal:" followed by the command.
2. Only provide setup details, no implementation code.

The generated output should include:
- Terminal commands for the backend setup.
- Code for each specified file, including:
  - **General Setup:**
    - `index.js` for Express server setup and database connection.
    - `config/database.js` for database configuration.
  - **Routes:**
    - A list of route files (`routes/[routeName].js`) that can be any number, with necessary routes and endpoints.
  - **Models:**
    - A list of model files (`models/[modelName].js`) that can be any number, defining the schemas.
  - **Middleware:**
    - A list of middleware files (`middleware/[middlewareName].js`) that can be any number, implementing required logic.
  - **Environment Variables:**
    - Sample content for the `.env` file, including necessary environment variables.
'''

parser = StrOutputParser()

def main():
    # Take user input for database name and port number
    database_name = input("Please enter the database name: ")
    port_number = input("Please enter the port number for the server: ")

    while True:
        input_text = input("What question do you have in mind? (Type 'exit' to quit): ")

        if input_text.lower() == 'exit':
            break

        if input_text:
            try:
                # Initialize the chat history
                chat_history.add_user_message(input_text)

                # Generate backend setup commands
                result_setup = llm.invoke(generic_template)  # Pass the template directly

                # Add the setup result to the chat history
                chat_history.add_ai_message(parser.invoke(result_setup))

                # Collect the route, model, and middleware files
                routes = ["userRoutes", "workoutRoutes", "exerciseRoutes"]  # Example route files
                models = ["User", "Workout", "Exercise"]  # Example model files
                middleware = ["authMiddleware", "loggerMiddleware"]  # Example middleware files

                # Process the general setup files
                templates = [
                    '''Now, generate the code for the backend application entry point using Node.js and Express.js. The structure includes:
                1. **Entry Point:**
                  - `index.js`
                Please provide the complete code for `index.js` to set up the Express server and connect to the database, using the database name from the .env file as `${DATABASE_NAME}`, and make sure you don't provide additional explanation.
                ''',
                    '''Next, generate the code for the database connection file in the backend application:
                2. **Database Connection:**
                  - `config/database.js`
                Please provide the complete code for `config/database.js` for database configuration make sure that you don't provide additional explanation.
                '''
                ]

                # Add templates for routes
                for route in routes:
                    templates.append(f'''Now, generate the code for the route file in the Node.js and Express.js application(no explanation required):
3. **Routes:**
   - `routes/{route}.js`
Please provide the code for the route file defining the necessary routes and endpoints. Make sure you don't provide additional explanation.
''')

                # Add templates for models
                for model in models:
                    templates.append(f'''Next, generate the code for the model file(no explanation required):
4. **Models:**
   - `models/{model}.js`
Please provide the code for the model file defining the schema for {model}. Make sure you don't provide additional explanation.
''')

                # Add templates for middleware
                for mw in middleware:
                    templates.append(f'''Finally, generate the code for the middleware file(no explanation required):
5. **Middleware:**
   - `middleware/{mw}.js`
Please provide the code for the middleware file implementing the required logic. Make sure you don't provide additional explanation.
''')

                # Environment variables with user input for database and port
                templates.append(f'''Finally, generate the code for the environment variables(no explanation required):
6. **Environment Variables:**
   - `.env`
The database name is `{database_name}` and the port number is `{port_number}`.
Please provide sample content for the `.env` file, including these variables. Make sure you don't provide additional explanation.
''')

                # Process each template to generate corresponding code
                for template in templates:
                    result_code = llm.invoke(template)  # Pass the template directly
                    chat_history.add_ai_message(result_code)
                    print(f"AI: {parser.invoke(result_code)}\n")

            except Exception as e:
                print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
