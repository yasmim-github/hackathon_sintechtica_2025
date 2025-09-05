import os
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# 1. Configurando - Usando Chroma Cloud
txt_folder = "data/processed_text"  # Path to your 17 TXT files

chroma_client = chromadb.CloudClient(
    api_key='',  # <-- USE SUA API KEY (Não comite a chave real)
    tenant='95b0f4dc-c88d-490f-b02b-c7cd3408f90a',      # <-- Seu TENANT ID
    database='research_agent_bd'            # <-- Seu DATABASE NAME
)

collection_name = "papers"
chunk_size = 512
chunk_overlap = 50

# Inicialize o seu modelo de embedding
embedder = SentenceTransformer('all-MiniLM-L6-v2')

db = chroma_client.get_database()
collection = db.get_or_create_collection(
    name=collection_name,
    metadata={"hnsw:space": "cosine"}
)

# 2. Função Helper para fazer chunks dos textos fornecidos
def chunk_text(text, chunk_size=512, chunk_overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - chunk_overlap
    return chunks

# 3. Main Loop: Processe os aquivos TXT
documents = []
metadatas = []
ids = []

for filename in os.listdir(txt_folder):
    if filename.endswith(".txt"):
        file_path = os.path.join(txt_folder, filename)
        
        print(f"Processing: {filename}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        chunks = chunk_text(text, chunk_size, chunk_overlap)
        
        for i, chunk in enumerate(chunks):
            # Crie um ID único para cada chunk
            chunk_id = f"{filename}_chunk_{i}"
            metadata = {"source": filename}
            
            documents.append(chunk)
            metadatas.append(metadata)
            ids.append(chunk_id)
            
        print(f"  - Created {len(chunks)} chunks from {filename}")

# 4. Gere Embeddings e os insira no Chroma Cloud
print(f"\nGenerating embeddings for {len(documents)} chunks...")
embeddings = embedder.encode(documents).tolist()

print("Uploading to Chroma Cloud...")
collection.add(
    documents=documents,
    embeddings=embeddings,
    metadatas=metadatas,
    ids=ids
)

print(f"Done! Successfully uploaded {len(documents)} chunks to Chroma Cloud.")
print(f"Collection: '{collection_name}' in Database: 'research_agent_bd'")