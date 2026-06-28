# Virtual Dispute System

A decentralized-style virtual dispute resolution system using MERN, Python (RAG), and llama.cpp.

## Project Structure

- **frontend/**: React + Vite UI.
- **backend/**: Express + Node.js API Gateway & MongoDB.
- **engine/**: Python FastAPI server for RAG (Retrieval Augmented Generation).
- **core/**: llama.cpp engine for local LLM inference.

## Screenshots of the Project
-Login/Authorization Page(DARK/LIGHT)
<img width="1845" height="906" alt="Screenshot 2026-06-28 212803" src="https://github.com/user-attachments/assets/5c5e0f67-3109-497c-bf3a-160236d72ae6" />
<img width="1838" height="897" alt="Screenshot 2026-06-28 212821" src="https://github.com/user-attachments/assets/90472333-281d-4a9e-b5c4-9b91f9462dcf" />


-User Dashboard Page(DARK/LIGHT)
<img width="1842" height="906" alt="Screenshot 2026-06-18 221953" src="https://github.com/user-attachments/assets/0c66c49c-5272-4e43-b532-dba08261a4f4" />
<img width="1841" height="907" alt="Screenshot 2026-06-18 222003" src="https://github.com/user-attachments/assets/e8b32f9f-bc54-4f20-b333-9ba2a99c0fea" />

-Rules
<img width="1287" height="812" alt="Screenshot 2026-06-18 223146" src="https://github.com/user-attachments/assets/8fe29cac-30f0-4a9d-8337-eac475b0d397" />

-Filing online Complaint/Case
<img width="1847" height="907" alt="Screenshot 2026-06-19 003203" src="https://github.com/user-attachments/assets/0f0355b7-7e44-40fb-b77c-babe3b0e0250" />
<img width="1847" height="905" alt="Screenshot 2026-06-18 221936" src="https://github.com/user-attachments/assets/7bc30c2f-f0f5-48f6-b4ee-fa2561ac49d0" />


-Receiving the Complaint/Case
<img width="1847" height="906" alt="Screenshot 2026-06-19 003256" src="https://github.com/user-attachments/assets/b6201903-f581-4928-9a4b-8af97dcc9fc1" />

-Final Conclusion of the Complaint/Case
<img width="1842" height="888" alt="Screenshot 2026-06-19 003320" src="https://github.com/user-attachments/assets/e97df086-128e-43bc-8952-43a537d86854" />

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
