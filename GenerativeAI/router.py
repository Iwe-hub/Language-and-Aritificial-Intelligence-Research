from transformers import pipeline
from transformers import AutoTokenizer, AutoModelForCausalLM
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#configure mistral model
pipe = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")

tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-v0.1")
mistral_model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-v0.1")

#query router
def route_query(query: str) -> str:
    prompt = f"""

    You are an artificial intelligence robot designed off the machine learning principle of LLM Routing.
    You are very intelligent, you possess skills that allow you to recieve user queries and route them to the model
    best equipped to handle the task. Your objective is hereby certain, recive user queries and route them to the best model
    required for the task, if that model is unable to fulfill its duties, you shall fullfill them.
    There are three models configured:
    1. GPT4-mini-o, this model is trained on the knowledge base mostly texts, anything that has to do with literature content GPT will handle.
    Essentially general text analysis.
    2. Claude-3, this model is assigned to translation. It's task is to translate texts on request, it is expected to translate Yoruba only,
    if another language is required, you are required to step in and fulfill the request.
    3. Gemini, this model is assigned to audio intepretation, reading, and translation. They are given full control of user queries that are audio related.
    Query: {query}
    When you receive a query relating to text please route to the GPT model, when you receive a translation request please route to Claude-2.0, and when you get an audio request
    you route it to Gemini.When all fails provide an answer using your own model. 

    """
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(mistral_model.device)
        outputs = mistral_model.generate(**inputs, max_new_tokens=3)
        decision = tokenizer.decode(outputs[0], skip_special_tokens=True).strip().lower()

        if "gpt" in decision:
            return "gpt"
        elif "claude" in decision:
            return "claude"
        return "mistral"
    except Exception as e:
        logger.error(f"routing failed: {e}")
        return "mistral"

#mistral fallback if models fail
async def mistral_fallback(mistral_prompt: str) -> str:
    """centralised fallback for all models"""
    inputs = tokenizer(mistral_prompt, return_tensors="pt").to(mistral_model.device)
    outputs = mistral_model.generate(
        **inputs,
        max_new_tokens = 200,
        temperature = 0.3,
        do_sample=False  #more deterministic
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)