import os
import requests
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from fastapi import FastAPI
from langserve import add_routes
from langchain_core.chains import LLMChain

load_dotenv()

# Initialize the Google Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

INFORMATICA_BASE_URL = os.getenv("INFORMATICA_BASE_URL")  
INFORMATICA_USERNAME = os.getenv("INFORMATICA_USERNAME")
INFORMATICA_PASSWORD = os.getenv("INFORMATICA_PASSWORD")

def get_informatica_token():
    """Authenticate with Informatica and retrieve the token."""
    auth_url = f"{INFORMATICA_BASE_URL}/v3/login"
    
    payload = {
        "username": INFORMATICA_USERNAME,
        "password": INFORMATICA_PASSWORD
    }
    
    response = requests.post(auth_url, json=payload)
    
    if response.status_code == 200:
        return response.json().get("accessToken")
    else:
        raise Exception(f"Failed to authenticate with Informatica: {response.text}")
    
def fetch_informatica_data(task_id):
    """Retrieve data from Informatica workflows."""
    token = get_informatica_token()
    data_url = f"{INFORMATICA_BASE_URL}/v3/data-integration/jobs/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(data_url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error fetching data: {response.text}")


# Initialize the chat message history
history = ChatMessageHistory()

# Parser for output
parser = StrOutputParser()

# Frontend setup chain
frontend_template = ChatPromptTemplate.from_template('''You are an expert software developer. Provide the **frontend setup** for an application.
Use the following context to create the frontend.

**Frontend File Structure Setup**:
terminal: mkdir {website_name}  
terminal: cd {website_name}  
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

Ensure the following for the **frontend setup**:
1. Terminal commands should start with "terminal:" followed by the command.
2. Only provide setup details, no implementation code.
''')

frontend_chain = LLMChain(
    llm=llm,
    prompt=frontend_template,
    output_parser=parser
)

# Backend setup chain
backend_template = ChatPromptTemplate.from_template('''You are an expert software developer. Provide the **backend setup** for an application.
Use the following frontend setup for context:

**Frontend Setup**:
{frontend_setup}

Ensure the following for the **backend setup**:
1. **Terminal commands** should start with "terminal:" followed by the command.
2. Only provide setup details, no implementation code.

The generated output should include:
- Terminal commands for the backend setup.
- Code for each specified file, including:
  - **General Setup** for the server and database.
  - **Routes** for Express routing.
  - **Models** for defining schemas.
  - **Middleware** logic.
  - **.env** for environment variables.
''')

backend_chain = LLMChain(
    llm=llm,
    prompt=backend_template,
    output_parser=parser
)

# Fetch Informatica data before running the AI chain
informatica_data = fetch_informatica_data("your_task_id")

# Generate backend setup using Informatica data
backend_setup_result = backend_chain.run({"informatica_data": informatica_data})

# Frontend code generation chain for each component
frontend_code_template = ChatPromptTemplate.from_template('''Now, generate the code for the {component_description}:
Please provide the complete code for {component_file} without additional explanation.''')

frontend_code_chain = LLMChain(
    llm=llm,
    prompt=frontend_code_template,
    output_parser=parser
)

# Backend code generation chain for each component
backend_code_template = ChatPromptTemplate.from_template('''Now, generate the code for the {component_description} in the backend application:
Please provide the complete code for {component_file} without additional explanation.''')

backend_code_chain = LLMChain(
    llm=llm,
    prompt=backend_code_template,
    output_parser=parser
)

# Backend code generation template for routes, middleware, and environment variables
backend_routes_template = ChatPromptTemplate.from_template('''Now, generate the code for the {route_name} route file in the backend application:
Please provide the complete code for {route_file} without additional explanation.''')

backend_middleware_template = ChatPromptTemplate.from_template('''Now, generate the code for the {middleware_name} middleware in the backend application:
Please provide the complete code for {middleware_file} without additional explanation.''')

backend_env_template = ChatPromptTemplate.from_template('''Now, generate the environment variables setup in a .env file for the backend application:
Please provide the complete list of environment variables required for this project.''')

backend_routes_chain = LLMChain(
    llm=llm,
    prompt=backend_routes_template,
    output_parser=parser
)

backend_middleware_chain = LLMChain(
    llm=llm,
    prompt=backend_middleware_template,
    output_parser=parser
)

backend_env_chain = LLMChain(
    llm=llm,
    prompt=backend_env_template,
    output_parser=parser
)

from fastapi import FastAPI, HTTPException
import requests

def get_informatica_token():
    return "your_token_here"


app = FastAPI(title="Langchain Server", version="1.0", description="A simple API server using Langchain runnable interfaces")

@app.post("/trigger-informatica-job/{task_id}")
def trigger_informatica_job(task_id: str):
    token = get_informatica_token()
    trigger_url = f"{INFORMATICA_BASE_URL}/v3/data-integration/jobs/{task_id}/start"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(trigger_url, headers=headers)
    if response.status_code == 200:
        return {"message": "Informatica job triggered successfully", "job_id": task_id}
    else:
        raise HTTPException(status_code=500, detail=f"Error triggering job: {response.text}")

@app.get("/fetch-informatica-data/{task_id}")
def fetch_informatica_data(task_id: str):
    token = get_informatica_token()
    fetch_url = f"{INFORMATICA_BASE_URL}/v3/data-integration/jobs/{task_id}/data"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.get(fetch_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {response.text}")

@app.get("/informatica-job-status/{task_id}")
def get_informatica_job_status(task_id: str):
    token = get_informatica_token()
    status_url = f"{INFORMATICA_BASE_URL}/v3/data-integration/jobs/{task_id}/status"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.get(status_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=500, detail=f"Error fetching job status: {response.text}")

@app.post("/stop-informatica-job/{task_id}")
def stop_informatica_job(task_id: str):
    token = get_informatica_token()
    stop_url = f"{INFORMATICA_BASE_URL}/v3/data-integration/jobs/{task_id}/stop"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    response = requests.post(stop_url, headers=headers)
    if response.status_code == 200:
        return {"message": "Informatica job stopped successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Error stopping job: {response.text}")

def main():
    while True:
        command = input("Enter command (trigger, fetch, status, stop, setup, exit): ")
        if command == "exit":
            break
        elif command == "trigger":
            task_id = input("Enter task ID: ")
            print(trigger_informatica_job(task_id))
        elif command == "fetch":
            task_id = input("Enter task ID: ")
            print(fetch_informatica_data(task_id))
        elif command == "status":
            task_id = input("Enter task ID: ")
            print(get_informatica_job_status(task_id))
        elif command == "stop":
            task_id = input("Enter task ID: ")
            print(stop_informatica_job(task_id))
        elif command == "setup":
            website_name = input("Enter website name: ")
            if website_name.lower() == 'exit':
                break
            print(f"Setting up frontend for {website_name}")

            # Generate frontend code dynamically
            frontend_code_files = [
                {"description": "main application entry point", "file": "src/index.js"},
                {"description": "main application component", "file": "src/App.js"},
                {"description": "Home page component", "file": "src/pages/Home.js"},
                {"description": "About page component", "file": "src/pages/About.js"},
                {"description": "Contact page component", "file": "src/pages/Contact.js"},
                {"description": "Navbar component", "file": "components/Navbar.js"},
                {"description": "Footer component", "file": "components/Footer.js"}
            ]
            
            for item in frontend_code_files:
                result_code = frontend_code_chain.run({"component_description": item["description"], "component_file": item["file"]})
                history.add_message(AIMessage(content=result_code))
                print(f"AI (Frontend Code - {item['description']}): {result_code}\n")

            # Ask for database and port
            database_name = input("Please enter the database name: ")
            port_number = input("Please enter the port number for the server: ")

            # Generate backend setup dynamically
            backend_setup_result = backend_chain.run({"frontend_setup": frontend_setup_result})
            history.add_message(AIMessage(content=backend_setup_result))
            print(f"AI (Backend Setup): {backend_setup_result}\n")

            # Generate backend code dynamically
            backend_code_files = [
                {"description": "main server file", "file": "server.js"},
                {"description": "user model file", "file": "models/userModel.js"},
                {"description": "database connection file", "file": "config/db.js"}
            ]
            
            for item in backend_code_files:
                result_code = backend_code_chain.run({"component_description": item["description"], "component_file": item["file"]})
                history.add_message(AIMessage(content=result_code))
                print(f"AI (Backend Code - {item['description']}): {result_code}\n")

            # Generate backend routes dynamically
            routes_files = [
                {"route_name": "userRoutes", "file": "routes/userRoutes.js"},
                {"route_name": "authRoutes", "file": "routes/authRoutes.js"}
            ]
            
            for route in routes_files:
                result_code = backend_routes_chain.run({"route_name": route["route_name"], "route_file": route["file"]})
                history.add_message(AIMessage(content=result_code))
                print(f"AI (Backend Route - {route['route_name']}): {result_code}\n")

            # Generate backend middleware dynamically
            middleware_files = [
                {"middleware_name": "authMiddleware", "file": "middleware/authMiddleware.js"},
                {"middleware_name": "errorMiddleware", "file": "middleware/errorMiddleware.js"}
            ]
            
            for middleware in middleware_files:
                result_code = backend_middleware_chain.run({"middleware_name": middleware["middleware_name"], "middleware_file": middleware["file"]})
                history.add_message(AIMessage(content=result_code))
                print(f"AI (Backend Middleware - {middleware['middleware_name']}): {result_code}\n")

            # Generate environment variables dynamically
            env_result = backend_env_chain.run({})
            history.add_message(AIMessage(content=env_result))
            print(f"AI (Environment Variables - .env file): {env_result}\n")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
