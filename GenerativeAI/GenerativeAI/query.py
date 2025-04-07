from langchain_openai import ChatOpenAI
from sentence_transformers import SentenceTransformer, util
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.prompts import PromptTemplate
from dbconnection import DBconnection
from Template import template
import os
import torch
import pandas
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


#enable langchain tracing
LANGCHAIN_TRACING_V2 = True

#initialise open api key
OPENAI_API_KEY = "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"

#model
model = ChatOpenAI(model="gpt-4o-mini", openai_api_key=OPENAI_API_KEY)


#implement rag functionality
def rag_function(query_text):
    db_conn = DBconnection()
    cursor = db_conn.collection.find()
    corpus = []
    for doc in cursor:
        if 'content' in doc and isinstance(doc['content'], str):
            corpus.append(doc['content'])

    #eoncode corpus and query tesxt
    query_embedding = db_conn.embeddings.embed_query(query_text)
    corpus_embedding = db_conn.embeddings.embed_documents(corpus)
    
    #perform vector search
    similarity_scores = util.cos_sim(query_embedding, corpus_embedding)[0]
    top_k = min(5, len(corpus))
    top_results = torch.topk(similarity_scores, k=top_k)

    #fetch document and scores 
    retrieved_docs = [f"{corpus[idx]} (Score:{score:.4f})" for score, idx in zip(top_results[0], top_results[1])]
    return retrieved_docs


#implement rag feature
rag_prompt = PromptTemplate(
    template=template,
    input_variables=["context"]
)

def execute_query(user_query) -> str:
    retrieved_output = rag_function(user_query)
    formatted_prompt = rag_prompt.format(context="\n".join(retrieved_output))
    system_message = SystemMessage(content=formatted_prompt)
    user_message = HumanMessage(content=user_query)
    messages = [system_message, user_message]
    response = model(messages)
    response_text = response.content
    logger.info("\nfinal response:\n", response_text)
    return {"response": response_text}





