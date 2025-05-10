from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_core.embeddings import Embeddings
from typing import List, Optional, Dict, Any
import logging


#initialise log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Create an adapter for SentenceTransformer
class DBconnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DBconnection, cls).__new__(cls)
            cls._instance.init_connection()
        return cls._instance
    
    def init_connection(self):
        mongoDB_cs = "mongodb+srv://bookmead:nGbJmzaaGg1Jf9U0@cluster0.st4wk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        
        try:
            self.client = MongoClient(mongoDB_cs)
            self.client.admin.command('ping')
            print(f"✓ Connected to MongoDB Atlas (v{self.client.server_info()['version']})")
            
            self.db = self.client["droid"]
            self.collection = self.db["literature"]
            self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            
        except Exception as e:
            print(f"Connection failed: {e}")
            raise

    def get_collection(self):
        if not hasattr(self, 'collection'):
            raise ValueError("Connection not initialized")
        return self.collection

    def get_vector_store(self):
        if not hasattr(self, 'collection'):
            raise ValueError("Connection not initialized")
        return MongoDBAtlasVectorSearch(
            collection=self.collection,
            embedding=self.embeddings,
            index_name="literature_index"
        )
    
def vector_search(self, query: str, k: int = 4, filter: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """
    Perform vector search with optional filtering
    """
    vector_store = self.get_vector_store()

    # Ensure filter is valid
    if filter:
        filter = {key: {"$eq": value} for key, value in filter.items()}
    else:
        filter = None

    results = vector_store.similarity_search_with_score(
        query=query,
        k=k,
        pre_filter=filter
    )
        
    return [
        {
            "content": doc.page_content,
            "score": float(score)
        }
        for doc, score in results
    ]





            