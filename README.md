# Prompt Flow
## Overview
![image](https://github.com/user-attachments/assets/da880975-11af-431d-842c-0f328534ffd9)

**Prompt Flow** is an AI-orchestrated code generation and autonomous deployment pipeline that utilizes LangChain and large language models (LLMs) to empower users in developing entire projects through natural language prompts. It automatically generates a complete folder structure, writes code, and configures all necessary files for specified frameworks or languages.


## Features


![image](https://github.com/user-attachments/assets/793c14f6-e4c0-4976-85a6-edbf076f70f9)

![image](https://github.com/user-attachments/assets/042b2c7e-b87e-433e-8897-d774a2bf243e)

![image](https://github.com/user-attachments/assets/f3e068fd-a6b7-4140-86a7-f83b1c03b41e)

![image](https://github.com/user-attachments/assets/b776a208-e05f-4321-aa92-4803f8c106d4)

![image](https://github.com/user-attachments/assets/bceac95f-3c65-452b-84b6-5e0826236b31)


## LCNC in Prompt-Flow

![image](https://github.com/user-attachments/assets/aa21ad62-d4cc-4742-b5ac-66d4d3858307)

![image](https://github.com/user-attachments/assets/c0b5ace8-f1df-4e80-bd5e-96923a874fa7)

## SRS Upload in Prompt-flow

![image](https://github.com/user-attachments/assets/72d4a15a-d3d6-44f3-bdaf-daf0f8268bd1)


## Technologies Used
- LangChain
- Docker
- AWS
- GCP
- Informatica
- Terraform
- CI/CD (GitHub Actions, Jenkins)
- Redis
- GraphQL
- WebSockets
- Kafka
- RabbitMQ
- Nginx
- OpenTelemetry
- OpenAI
- Hugging Face
- TensorFlow
- PyTorch

### Frontend Technologies
- React
- Next.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- WebAssembly
- Svelte
- SolidJS

### Backend Technologies
- Node.js
- Express.js
- Flask
- FastAPI
- Django
- Golang
- Spring Boot
- Rust
- Elixir
- .NET Core
- Haskell
- Clojure

### Databases
- Firebase
- PostgreSQL
- MySQL
- MongoDB
- Cassandra
- Neo4j
- CockroachDB
- Redis
- DynamoDB

### DevOps Tools
- Kubernetes
- Docker
- Helm
- Prometheus
- Grafana
- Ansible
- Terraform
- Istio
- Linkerd
- Jenkins
- ArgoCD
- Spinnaker
- Consul

## Key Comparisons
1. **Full SDLC Automation vs. Manual Setup**
   - Unlike traditional development requiring manual setup for coding, testing, and deployment, Prompt Flow automates the entire SDLC, significantly reducing time and complexity.

2. **Dynamic Web Access for Real-Time Updates vs. Static Frameworks**
   - While current tools rely on predefined support for frameworks, Prompt Flow dynamically accesses web resources for up-to-date documentation, enabling it to adapt to cutting-edge frameworks and evolving languages effortlessly.

## Comprehensive Infrastructure
- Utilizes Docker, LangChain, Informatica, and access to cloud providers (AWS, GCP) for dynamic project execution, deployment, and web access, supporting CI/CD integration and real-time updates for evolving frameworks.
- Implements Terraform and Kubernetes for infrastructure automation and container orchestration, ensuring scalability and reliability.
- Employs Redis for high-performance caching, WebSockets for real-time communication, and Kafka/RabbitMQ for distributed messaging.
- Integrates Istio and Linkerd for service mesh solutions, enhancing observability, security, and traffic management.
- Implements OpenTelemetry for distributed tracing and monitoring of microservices architecture.
- Uses OpenAI and Hugging Face for state-of-the-art AI model deployment and processing.
- Leverages TensorFlow and PyTorch for advanced machine learning and deep learning capabilities.

## LLM and LangChain Optimization
- Features an optimized LLM integrated with LangChain for natural language processing, focusing on efficient prompt handling, accurate code generation, and seamless cloud deployment.
- Enhances performance using GraphQL for efficient API interactions and Golang for high-speed backend processing.
- Leverages Prometheus and Grafana for real-time monitoring and performance analytics, ensuring system reliability and efficiency.
- Adopts Rust and Elixir for highly concurrent, low-latency backend processing, improving overall system responsiveness.
- Integrates .NET Core and Haskell for functional programming paradigms, improving code efficiency and maintainability.

## Installation

To set up Prompt Flow locally, follow these steps:

### Prerequisites
- Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- Make sure you have [Git](https://git-scm.com/downloads) installed.
- Make sure you create a [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key).
- Install [Node.js](https://nodejs.org/en/) and [Python](https://www.python.org/downloads/).
- Install Terraform, Kubernetes CLI (kubectl), and Helm.
- Ensure PostgreSQL and Redis are installed and running.

### Steps to Install

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryamanpathak2022/Prompt-flow.git && cd Prompt-flow
   ```

2. **Pull the Docker image**:
   ```bash
   docker pull nikolaik/python-nodejs && docker run -it --rm nikolaik/python-nodejs bash
   ```

3. **Set up the Web App**:
   ```bash
   cd webapp
   npm install && npm run build && npm run dev
   ```

4. **Set up the Backend**:
   ```bash
   cd ../api-server/src
   pip install -r requirements.txt
   python3 index.py
   ```

5. **Configure Environment Variables**:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export GCP_PROJECT_ID=your_project_id
   export GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
   export DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   export REDIS_URL=redis://localhost:6379
   export INFORMATICA_BASE_URL=YOUR_INFORMATICA_BASE_URL
   export INFORMATICA_USERNAME=YOUR_INFORMATICA_USERNAME
   export INFORMATICA_PASSWORD=YOUR_INFORMATICA_PASSWORD
   ```

6. **Run Database Migrations**:
   ```bash
   cd ../database
   python migrate.py
   ```

7. **Run the DevOps Setup**:
   ```bash
   terraform init && terraform apply -auto-approve
   kubectl apply -f k8s/
   helm install promptflow ./helm_chart
   ```

8. **Verify the Deployment**:
   ```bash
   curl -X GET http://localhost:8000/health
   ```

Now, Prompt Flow is fully set up and running!
