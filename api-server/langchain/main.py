print("LLM STARTED INSIDE DOCKER CONTAINER")

import os
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from run_command import run_command,run_command_create
from zip_upload import upload_zip_to_firebase
import shutil
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain import ConversationChain
from langchain.memory import ConversationBufferMemory
import re

def remove_special_characters_ends(text):
    # This regex pattern removes special characters from the beginning and end of the string
    return re.sub(r'^[^a-zA-Z0-9\s]+|[^a-zA-Z0-9\s]+$', '', text)

# Set up the API key from environment variables
os.environ["GOOGLE_API_KEY"] = "AIzaSyCT8ZiaBxWtiM2UaVykpZBKlVZVZ95PM8Q"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.7)

context='''You are an expert software developer.Provide initial setup for frontend application Initial Setup. dont include file structure and rememeer at last Ensure the following:
give   Initial Setup
1. **Terminal commands** should start with "terminal:" followed by the command.
2.only setup dont include code and all only setup

3. example output:
terminal: mkdir my-frontend-app
terminal: cd my-frontend-app
terminal: npm init -y
terminal: npm install react react-dom
terminal: mkdir src
terminal: touch src/index.js
terminal: touch src/App.js"
'''

user_input = "create gym website"

# Create a prompt template
prompt_template = PromptTemplate.from_template(f"{user_input}\n{context.replace('{', '{{').replace('}', '}}')}")


# Create a chain
chain = LLMChain(llm=llm, prompt=prompt_template)

try:
    # response = chain.invoke({"user_input": user_input})
    print("response")

except Exception as e:
    print(f"An error occurred: {e}")



# Initialize memory
memory = ConversationBufferMemory()

# Create a conversation chain with memory
conversation_chain = ConversationChain(llm=llm, memory=memory)

# Simulate conversation
response1 = conversation_chain.run(f"{user_input}\n{context.replace('{', '{{').replace('}', '}}')}")



context2 ='''You are an expert software developer.now the initial setup is done give only the names of all the pages in this project only the names  Ensure the following:
give 
1. include the names of all the pages in this project only the names
2. make it elaborative not 2-3 ake it full all the pages as it is in real life

'''
response2=conversation_chain.run(f"{user_input}\n{context2.replace('{', '{{').replace('}', '}}')}")


def extract_pages(text):
    # Split the text into lines
    lines = text.strip().split('\n')

    # Initialize an empty list to store the pages
    pages = []

    # Iterate over each line and extract pages
    for line in lines:
        line = line.strip()
        # Skip empty lines and lines that don't represent pages
        if line and not line.startswith('**'):
            pages.append(line)
        # If it's a sub-page (nested), extract it accordingly
        elif line.startswith('*'):
            pages.append(line[2:].strip())  # Remove the "* " prefix

    return pages

# Example usage
text = """
Okay, let's imagine a fully-fledged gym website. Here's an expanded list of potential pages, going beyond the basics:

**Main Navigation**

* **Home:**  The main landing page with introductory information, potentially a hero image or video, and highlights of what the gym offers.
* **About Us:**  Details about the gym's mission, history, values, and potentially staff introductions.
* **Classes:**  A listing of all classes, ideally with filtering options (by type, level, time, instructor).
* **Class Schedule:** A calendar-based view of the class schedule for easy browsing.
* **Trainers:**  Profiles of each trainer, highlighting their expertise, certifications, and potentially client testimonials.
* **Pricing:**  Transparent breakdown of membership options, class packages, and any other fees.
* **Contact Us:**  Contact information, potentially a contact form, and maybe a map showing the gym's location.

**Additional Pages (Potentially Nested)**

* **Gallery:** Photos or videos of the gym facilities, classes in action, and members.
* **Blog:**  Articles related to fitness, nutrition, workout tips, member stories, etc.
* **FAQs:** Answers to commonly asked questions about the gym.
* **Testimonials:** A dedicated section for positive member reviews.
* **Careers:** If the gym is hiring, a page with job postings and application information.
* **Member Portal (Login Required):**
    * **My Account:** For members to manage their profile, payment information, and bookings.
    * **Class Bookings:**  A system for members to reserve spots in classes.
    * **Progress Tracking:**  A tool for members to log workouts, track progress, and set goals (if the gym offers this).
"""

# Call the function and print the result
pages = extract_pages(text)
for page in pages:
    print(page)



context3='''You are an expert software developer.now the initial setup is done give the code of  and inclide the stylind codee also the page  **About Us:**  Details about the gym's mission, history, values, and potentially staff introductions.. in a format like first"code" then its fille path then real code  project only the names  Ensure the following:
1} outut format
CODE: src/app.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="App">
      <h1>Counter App</h1>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default App;

2) use images form web like unsplash
'''

response3=conversation_chain.run(f"{user_input}\n{pages[0]}\n{context3.replace('{', '{{').replace('}', '}}')}")




def extract_terminal_commands(input_string):
    # Split the input string by lines
    lines = input_string.split('\n')

    # Filter and extract lines that start with 'terminal:'
    commands = [line.replace('terminal: ', '').strip() for line in lines if 'terminal:' in line]

    return commands

# Example usage


input_string = response1



print()  # Change 'data' to the appropriate key
commands_list = extract_terminal_commands(input_string)
print(commands_list)

def clean_commands(command_list):
    return [command.strip('`').strip() for command in command_list]
cleaned_commands = clean_commands(commands_list)


final_commands=[]
for command in cleaned_commands:
  final_commands.append(remove_special_characters_ends(command))
  

# run_command("RUN apt-get update")
# run_command('apt install npm')
run_command('mkdir frontend',"/")
run_command('npm init -y')
run_command('npm install react')


for command in final_commands:
    print(command)
    run_command('npm cache clean --force')
    run_command(command)
# run_command("mkdir gym-website-frontend")
# run_command("cd gym-website-frontend")
# run_command("touch aryaman.txt")
# run_command("ls")





# Usage
# zip_current_folder('frontend')

upload_zip_to_firebase("package.json")