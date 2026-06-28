# Virtual Dispute System - AI & Models Guide

This document summarizes the AI models used in the project for quick reference during interviews.

## 1. Large Language Model (The Brain)
- **Model Name**: `Llama-3.2-1B-Instruct-GGUF`
- **Source**: Hugging Face (bartowski/Llama-3.2-1B-Instruct-GGUF)
- **Purpose**: Generates the final legal analysis, summarizes the dispute, and proposes resolutions.
- **Why this model?**: 
    - **Size**: 1 Billion parameters (Small/Fast).
    - **Optimization**: GGUF format for local inference.
    - **Performance**: High reasoning capability for its size, optimized for instruction-following.

## 2. Embedding Model (The Searcher)
- **Model Name**: `all-MiniLM-L6-v2`
- **Source**: Hugging Face (Sentence Transformers)
- **Purpose**: Converts text (law clauses and user queries) into "vectors" (mathematical coordinates).
- **Use Case**: Used by the RAG system to find the most relevant laws in the `FAISS` database.
- **Why this model?**: Industry standard for fast, high-quality sentence embeddings in local environments.

## 3. Core Engine (The Runner)
- **Tool**: `llama.cpp` (Vulkan Version)
- **Purpose**: A high-performance C++ implementation for running LLMs locally.
- **Acceleration**: Uses **Vulkan API** to offload computation to the GPU (NVIDIA RTX 3050), ensuring real-time response times.

---

### Interview Tip: The RAG Flow
1. **User submits query** -> `all-MiniLM-L6-v2` turns it into a vector.
2. **Search** -> `FAISS` finds the closest matching law clauses.
3. **Analyze** -> Law clauses + User input are sent to `Llama-3.2-1B` via `llama.cpp`.
4. **Result** -> AI provides a legally grounded conclusion.
