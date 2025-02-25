# Prompt Flow
## Overview
![image](https://github.com/user-attachments/assets/f4e48cde-9781-4686-a484-f5902ded0c30)

**Prompt Flow** is an AI-orchestrated code generation and autonomous deployment pipeline that utilizes LangChain and large language models (LLMs) to empower users in developing entire projects through natural language prompts. It automatically generates a complete folder structure, writes code, and configures all necessary files for specified frameworks or languages.


## Features

![image](https://github.com/user-attachments/assets/111594d9-c984-4b6e-98d1-db130fc7b6bd)


![image](https://github.com/user-attachments/assets/c172a6a1-4f16-4ff8-8200-03ed821bf10b)

![image](https://github.com/user-attachments/assets/cd39df3c-b249-423d-a037-455020abc5e3)

![image](https://github.com/user-attachments/assets/1d6a2237-f386-488a-b870-53c9da2320a3)

![image](https://github.com/user-attachments/assets/191408d6-7d9f-43c5-97f5-7d25141c73b2)


## Our Chat Bot

![image](https://i.postimg.cc/yxwPyYzd/image.png)


## Technologies Used
- LangChain
- Docker
- AWS
- GCP

### Frontend Technologies
- React
- Next.js

### Backend Technologies
- Node.js
- Express.js
- Flask

### Databases
-Firebase

### DevOps Tools
- Kubernetes
- Docker

## Key Comparisons
1. **Full SDLC Automation vs. Manual Setup**
   - Unlike traditional development requiring manual setup for coding, testing, and deployment, Prompt Flow automates the entire SDLC, significantly reducing time and complexity.

2. **Dynamic Web Access for Real-Time Updates vs. Static Frameworks**
   - While current tools rely on predefined support for frameworks, Prompt Flow dynamically accesses web resources for up-to-date documentation, enabling it to adapt to cutting-edge frameworks and evolving languages effortlessly.

## Comprehensive Infrastructure
- Utilizes Docker, LangChain, and access to cloud providers (AWS, GCP) for dynamic project execution, deployment, and web access, supporting CI/CD integration and real-time updates for evolving frameworks.

## LLM and LangChain Optimization
- Features an optimized LLM integrated with LangChain for natural language processing, focusing on efficient prompt handling, accurate code generation, and seamless cloud deployment.

## Installation

To set up Prompt Flow locally, follow these steps:

### Prerequisites
- Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- Make sure you have [Git](https://git-scm.com/downloads) installed.
- Make sure you Create [GeminiApiKey](https://ai.google.dev/gemini-api/docs/api-key)

### Steps to Install
1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryamanpathak2022/Prompt-flow.git

1. **Pull the Docker image**:
   ```bash
   docker pull nikolaik/python-nodejs

1. **Run the Web app **:
   ```bash
   cd webapp
   cd Prompt-flow
   npm i
   npm run dev
   
1. **Run the backend **:
   ```bash
   cd api-server
   cd src
   node index.js
   
1. **Configure Environment Variables:**:
   ```bash
   AWS_ACCESS_KEY_ID=your_access_key    #for deploying
   AWS_SECRET_ACCESS_KEY=your_secret_key   #for deploying
   GCP_PROJECT_ID=your_project_id  #For firebase database
   GOOGLE_API_KEY=YOUR_GEMINI_API_KEY    #Gen ai

1. **Install Dependencies:**:
   ```bash
   cd api-backend
   cd langchain
   pip install -r requirements.txt
