import os
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter

DATA_PATH = "data/law_book.txt"
INDEX_PATH = "vector_store"

def initialize_rag():
    # Load the law book
    if not os.path.exists(DATA_PATH):
        print(f"Data file not found at {DATA_PATH}")
        return None
    
    loader = TextLoader(DATA_PATH, encoding="utf-8")
    documents = loader.load()
    
    # Split text into chunks
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = text_splitter.split_documents(documents)
    
    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create or load vector store
    if os.path.exists(os.path.join(INDEX_PATH, "index.faiss")):
        vectorstore = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    else:
        vectorstore = FAISS.from_documents(docs, embeddings)
        vectorstore.save_local(INDEX_PATH)
    
    return vectorstore

def get_relevant_laws(query, vectorstore):
    if not vectorstore:
        return ""
    
    docs = vectorstore.similarity_search(query, k=2)
    return "\n".join([doc.page_content for doc in docs])

if __name__ == "__main__":
    vs = initialize_rag()
    res = get_relevant_laws("What is the punishment for theft?", vs)
    print("Relevant Laws Found:")
    print(res)
