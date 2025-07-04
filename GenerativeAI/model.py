from langchain_openai import ChatOpenAI
import anthropic
import asyncio
from fastapi import HTTPException
from router import mistral_fallback
import logging

#setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#enable langchain tracing
LANGCHAIN_TRACING_V2 = True

#GPT model
#initialise open api key
OPENAI_API_KEY = ""
#model
GPTmodel = ChatOpenAI(model="gpt-4o-mini", openai_api_key=OPENAI_API_KEY)


#Claude model
#initialise api key
claude_client = anthropic.AsyncAnthropic(
    api_key="",
    max_entries=3
)


#translation service
async def handle_translation_flow(book_content: str):
    """handles Yoruba only translation flow"""
    target_lang = input("enter target language: ").strip()
    text_to_translate = input("enter text to translate to Yoruba (or 'all' for entire book): ").strip()

    if text_to_translate.lower() == 'all':
        text_to_translate = book_content
    elif not text_to_translate:
        logger.info("no text provided")
        return
    
    try:
        translated = await translate_text(text_to_translate)
        logger.info(f"\nTRANSLATION:\n{'-'*40}")
        logger.info(translated)
        logger.info('-'*40)
    except Exception as e:
        logger.info(f"translation failed: {str(e)}")



async def translate_text(text: str) -> str:
    """
    1. Always try Claude-3 first, it's the best for translation.
    2. Fallback to Mistral if Claude fails.
    """
    claude_prompt = f""" Translate this to Yoruba
    return ONLY the translated text without commentary:
    {text}"""

    #try claude first
    try:
        claude_response = await claude_client.messages.create(
            model="claude-2.0",
            max_tokens=1000,
            messages=[{"role": "user", "content": claude_prompt}]
        )
        return claude_response.content[0].text.strip()
    except Exception as e:
        logger.warning(f"claude translation failed, falling back to Mistral. error: {e}")
        return await mistral_fallback(claude_prompt)
