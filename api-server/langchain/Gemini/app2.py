import os
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

# FastAPI app setup
app = FastAPI(title="Langchain Server", version="1.0", description="A simple API server using Langchain runnable interfaces")

def main():
    while True:
        website_name = input("Please enter the website name you are trying to build: ")

        if website_name.lower() == 'exit':
            break

        if website_name:
            try:
                # Record the user input in chat history
                history.add_message(HumanMessage(content=f"Please generate a frontend setup for {website_name}"))

                # Generate frontend setup dynamically
                frontend_setup_result = frontend_chain.run({"website_name": website_name})
                
                # Record the AI output in chat history
                history.add_message(AIMessage(content=frontend_setup_result))
                
                print(f"AI (Frontend Setup): {frontend_setup_result}\n")

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

            except Exception as e:
                print(f"An error occurred: {e}")

# Adding routes to the FastAPI app for dynamic frontend/backend setup
add_routes(app, frontend_chain, path="/frontend-setup")
add_routes(app, frontend_code_chain, path="/frontend-code-setup")
add_routes(app, backend_chain, path="/backend-setup")
add_routes(app, backend_code_chain, path="/backend-code-setup")
add_routes(app, backend_routes_chain, path="/backend-route-setup")
add_routes(app, backend_middleware_chain, path="/backend-middleware-setup")
add_routes(app, backend_env_chain, path="/backend-env-setup")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
