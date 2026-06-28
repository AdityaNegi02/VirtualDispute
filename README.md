# Virtual Dispute System

A decentralized-style virtual dispute resolution system using MERN, Python (RAG), and llama.cpp.

## Project Structure

- **frontend/**: React + Vite UI.
- **backend/**: Express + Node.js API Gateway & MongoDB.
- **engine/**: Python FastAPI server for RAG (Retrieval Augmented Generation).
- **core/**: llama.cpp engine for local LLM inference.

## Setup Instructions

### 1. llama.cpp (The Brain)
- Download `llama.cpp` from GitHub and compile it.
- Download a GGUF model (e.g., Llama-3-8B-Instruct-GGUF).
- Start the server:
  ```bash
  .\llama-server.exe -m .\models\Llama-3.2-1B-Instruct-Q4_K_M.gguf --port 8080
  ```

### 2. Python Engine (The RAG layer)
- Navigate to `engine/`.
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Start the engine:
  ```bash
  python main.py
  ```
- It will run on `http://localhost:8000`.

### 3. Backend (The Gateway)
- Navigate to `backend/`.
- Create a `.env` file with `MONGO_URI` and `PORT=5000`.
- Install dependencies:
  ```bash
  npm install
  ```
- Start the server:
  ```bash
  npm run dev
  ```

### 4. Frontend (The Interface)
- Navigate to `frontend/`.
- Install dependencies:
  ```bash
  npm install
  ```
- Start the UI:
  ```bash
  npm run dev
  ```

## Workflow
1. User submits a dispute via the Frontend.
2. Backend saves the case and calls the Python Engine.
3. Python Engine retrieves relevant law clauses from `data/law_book.txt` using FAISS.
4. Python Engine sends the context to `llama.cpp` (running on port 8080).
5. The conclusion is returned to the Backend and displayed on the Frontend.
