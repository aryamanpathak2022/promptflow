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
