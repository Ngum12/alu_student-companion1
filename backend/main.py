
import os
import json
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Import the modules
from document_processor import DocumentProcessor
from retrieval_engine_extended import ExtendedRetrievalEngine
from prompt_engine import PromptEngine
from prompt_engine.nyptho_integration import NypthoIntegration

# Create FastAPI app
app = FastAPI(title="ALU Chatbot Backend")

# Add CORS middleware to allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Will accept connections from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
document_processor = DocumentProcessor()
retrieval_engine = ExtendedRetrievalEngine()
prompt_engine = PromptEngine()
nyptho = NypthoIntegration()  # Initialize Nyptho

# Define request models
class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []
    options: Optional[Dict[str, Any]] = None

class QueryRequest(BaseModel):
    query: str
    role: str = "student"
    conversation_history: List[Dict[str, Any]] = []
    options: Optional[Dict[str, Any]] = None

class DocumentMetadata(BaseModel):
    title: str
    source: str
    date: Optional[str] = None

class PersonalitySettings(BaseModel):
    helpfulness: float
    creativity: float
    precision: float
    friendliness: float

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ALU Chatbot backend is running"}

@app.get("/health")
async def health():
    """Health check endpoint with detailed system status"""
    try:
        # Get component statuses
        brain_status = retrieval_engine.alu_brain is not None
        nyptho_status = nyptho.get_status()
        
        # Return comprehensive health information
        return {
            "status": "healthy",
            "components": {
                "retrieval_engine": "online",
                "alu_brain": "online" if brain_status else "offline",
                "prompt_engine": "online",
                "nyptho": nyptho_status
            },
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "development")
        }
    except Exception as e:
        print(f"Health check error: {e}")
        raise HTTPException(status_code=500, detail="System health check failed")

@app.post("/chat")
async def chat(request: ChatRequest):
    """Process a chat message and return a response"""
    try:
        # Extract the user message
        query = request.message
        
        # Convert history format if needed
        conversation_history = []
        for item in request.history:
            role = item.get("role", "user")
            content = item.get("content", "")
            conversation_history.append({"role": role, "content": content})
        
        # Get the role from options or default to student
        role = "student"
        if request.options and "role" in request.options:
            role = request.options["role"]
        
        # Get relevant context from the retrieval engine
        context_docs = retrieval_engine.retrieve_context(
            query=query,
            role=role
        )
        
        # Generate response using the prompt engine
        response = prompt_engine.generate_response(
            query=query,
            context=context_docs,
            conversation_history=conversation_history,
            role=role,
            options=request.options
        )
        
        # Have Nyptho observe this interaction
        nyptho.observe_model(
            query=query,
            response=response,
            model_id="alu_prompt_engine",
            context=context_docs
        )
        
        # Extract sources for attribution
        sources = []
        for doc in context_docs[:3]:  # Top 3 sources
            if doc.metadata and 'source' in doc.metadata:
                source = {
                    'title': doc.metadata.get('title', 'ALU Knowledge Base'),
                    'source': doc.metadata.get('source', 'ALU Brain')
                }
                if source not in sources:  # Avoid duplicates
                    sources.append(source)
        
        return {
            "response": response,
            "sources": sources,
            "engine": "alu_prompt_engine"
        }
    except Exception as e:
        print(f"Error processing chat message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate_response(request: QueryRequest):
    """Generate a response for the user query"""
    try:
        # Get relevant context from the retrieval engine
        context_docs = retrieval_engine.retrieve_context(
            query=request.query, 
            role=request.role
        )
        
        # Check if we should use Nyptho
        use_nyptho = False
        if request.options and "use_nyptho" in request.options:
            use_nyptho = request.options["use_nyptho"]
        
        # Set model ID for observation
        model_id = "standard_engine"
        
        # Generate response using appropriate engine
        if use_nyptho and nyptho.get_status()["ready"]:
            # Use Nyptho for response
            personality = None
            if request.options and "personality" in request.options:
                personality = request.options["personality"]
                
            response = nyptho.generate_response(
                query=request.query,
                context=context_docs,
                personality=personality
            )
            model_id = "nyptho"
        else:
            # Use standard prompt engine
            response = prompt_engine.generate_response(
                query=request.query,
                context=context_docs,
                conversation_history=request.conversation_history,
                role=request.role,
                options=request.options
            )
        
        # Have Nyptho observe this interaction (it learns from all responses)
        if model_id != "nyptho":  # Don't observe itself
            nyptho.observe_model(
                query=request.query,
                response=response,
                model_id=model_id,
                context=context_docs
            )
        
        return {
            "response": response,
            "sources": [doc.metadata for doc in context_docs[:3]] if context_docs else [],
            "engine": model_id
        }
    except Exception as e:
        print(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(None),
    source: str = Form("user-upload"),
    background_tasks: BackgroundTasks = None
):
    """Upload and process a document into the vector store"""
    try:
        # Process the document
        doc_id = await document_processor.process_document(file, title, source)
        
        # Add background task to update the vector store
        if background_tasks:
            background_tasks.add_task(
                retrieval_engine.update_vector_store,
                doc_id
            )
        
        return {"status": "success", "message": "Document uploaded successfully", "doc_id": doc_id}
    except Exception as e:
        print(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents():
    """List all available documents in the knowledge base"""
    try:
        documents = document_processor.list_documents()
        return {"documents": documents}
    except Exception as e:
        print(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the knowledge base"""
    try:
        success = document_processor.delete_document(doc_id)
        if success:
            # Update the vector store to remove the document's embeddings
            retrieval_engine.remove_document(doc_id)
            return {"status": "success", "message": "Document deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rebuild-index")
async def rebuild_index(background_tasks: BackgroundTasks):
    """Rebuild the vector index with all documents"""
    try:
        background_tasks.add_task(retrieval_engine.rebuild_index)
        return {"status": "success", "message": "Index rebuild started in the background"}
    except Exception as e:
        print(f"Error starting index rebuild: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Nyptho-specific endpoints
@app.get("/nyptho/status")
async def get_nyptho_status():
    """Get the current status of Nyptho"""
    try:
        status = nyptho.get_status()
        return status
    except Exception as e:
        print(f"Error getting Nyptho status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nyptho/personality")
async def set_nyptho_personality(settings: PersonalitySettings):
    """Update Nyptho's personality settings"""
    try:
        result = nyptho.set_personality({
            "helpfulness": settings.helpfulness,
            "creativity": settings.creativity,
            "precision": settings.precision,
            "friendliness": settings.friendliness
        })
        return result
    except Exception as e:
        print(f"Error updating personality: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search-stats")
async def get_search_stats():
    """Get search engine performance statistics"""
    try:
        search_stats = retrieval_engine.alu_brain.search_engine.get_search_stats()
        return search_stats
    except Exception as e:
        print(f"Error getting search stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)  # Set reload to False for production
