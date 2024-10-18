from fastapi import FastAPI, HTTPException

from pydantic import BaseModel

import json
import ast
import re

app = FastAPI()

import google.generativeai as genai
from dotenv import load_dotenv
import os
from scraper import scrape

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from bson.objectid import ObjectId

load_dotenv()
gemini_api_key = os.getenv('GEMINI_API')
if not gemini_api_key:
    raise HTTPException(status_code=500, detail="No GEMINI_API key set in .env file")
genai.configure(api_key=gemini_api_key)

mongodb_url=os.getenv('MONGODB_URL')
client = MongoClient(mongodb_url, server_api=ServerApi('1'))
db = client['FinAdvise']
chat_collection = db['chats']
paired_message_collection = db['pairedmessages']

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

default_prompt = '''
You are an AI financial advisor integrated within FinAdvise, a platform specifically designed to assist young professionals in India who are new to managing their finances. These users are recent graduates who have just started earning and are looking for guidance on how to invest their money wisely.

Your role is to provide India-specific, practical financial advice that resonates with the unique needs and concerns of this younger audience. You should address questions related to investment strategies, savings, budgeting, tax planning, risk management, and financial literacy, all within the context of the Indian financial landscape.

The questions you may encounter include, but are not limited to:

How should I allocate my salary for savings, investments, and expenses?
What are the best investment options in India for someone with a moderate risk tolerance?
How can I start investing with a limited budget?
What tax-saving instruments are available for salaried individuals in India?
Should I invest in mutual funds, stocks, or fixed deposits in India?
How do I balance short-term and long-term financial goals?
What is the importance of having an emergency fund before investing?
How can I track the performance of my investments?
What are the risks and benefits of investing in cryptocurrencies in India?
How do I navigate the Indian financial markets as a new investor?
Your responses should be informative, actionable, and tailored to the Indian context, offering guidance that empowers users to make informed financial decisions. Consider the user's risk tolerance, financial goals, current economic conditions, and the unique challenges and opportunities present in the Indian market when providing advice.

Your responses can be in Markdown. Include tables if necessary. Use bullet points to make things clear.
'''

url_list = [
    'https://www.moneycontrol.com/news/business',]

prepared_headlines = ""

# Model for financial advice
advice_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

advice_convo = advice_model.start_chat(history=[
    {
        "role": "user",
        "parts": [default_prompt]
    },
    {
        "role": "model",
        "parts": ["Welcome to FinAdvise! Feel free to ask me anything finance related."]
    },
])

news_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

news_convo = advice_model.start_chat(history=[
    {
        "role": "user",
        "parts": ["you are a news bot that goes through a chunk of text and extracts all the indivisual news headlines from it. return a list of these headlines."]
    },
    {
        "role": "model",
        "parts": ["Welcome to FinAdvise! Send me a chunk of text from which I will extract news headlines."]
    },
])

'''
We can create different model instances and different endpoints for each action that the model has to perform.
'''

summarizer_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

summarizer_convo = summarizer_model.start_chat(history=[
    {
        "role": "user",
        "parts": ["you are a chat summarizer. you will accept multiple messages from the user and return a summary of what was discussed in the conversation and a conclusion of the conversation, if there was one."]
    },
    {
        "role": "model",
        "parts": ["Welcome to FinAdvise! Send me a bunch of messages and i will summarize them."]
    }
])

followup_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

followup_convo = followup_model.start_chat(history=[
    {
        "role": "user",
        "parts": ["you must act like a user asking financial questions and generate 3 follow-up questions that a user can ask. you will accept a response that an AI model has generated for a financial question along with the original question that the user had asked. then think of 3 simple follow-up questions that the user can ask and return ONLY the questions. Do not say \"here are 3 questions\" or anything else. simply return the 3 questions."]
    },
    {
        "role": "model",
        "parts": ["got it!"]
    }
])

class summarizeInput(BaseModel):
    text: str

# Function to start a new conversation or reuse the previous context
def get_advice_convo(chat_history):
    base_history = [
        {"role": "user", "parts": [default_prompt]},
        {"role": "model", "parts": ["Welcome to FinAdvise! Feel free to ask me anything finance related."]}
    ]
    
    if chat_history:
        history = []

        for pm_id in chat_history:
            # Retrieve the paired message object using its ObjectId
            paired_message = paired_message_collection.find_one({"_id": ObjectId(pm_id)})
            
            if paired_message:
                # Append the user's message
                history.append({
                    "role": "user",
                    "parts": [paired_message['input']]
                })
                
                # Append the model's response
                history.append({
                    "role": "model",
                    "parts": [paired_message['response']]
                })
            else:
                print(f"Paired message with ID {pm_id} not found.")

        full_history = base_history + history
    else:
        full_history = base_history

    return genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
        safety_settings=safety_settings,
    ).start_chat(history=full_history)

class AdviceInput(BaseModel):
    input_text: str
    chatId: str

def extract_follow_up_questions(response):
    # Use regex to extract the content between <<< and >>>
    pattern = r'<<<(.*?)>>>'
    match = re.search(pattern, response, re.DOTALL)
    
    if match:
        follow_up_text = match.group(1).strip()
        
        # Split the follow-up questions by line or number bullet points
        follow_up_questions = [question.strip() for question in follow_up_text.splitlines() if question.strip()]
        
        # Clean up any leading numbers or bullet points if present
        follow_up_questions = [re.sub(r'^\d+\. ', '', question) for question in follow_up_questions]
    else:
        follow_up_questions = []

    return follow_up_questions

def create_json_response(advice, follow_up_questions):
    response_dict = {
        "advice": advice,
        "follow_up_questions": follow_up_questions
    }
    
    # Convert dictionary to JSON string
    return json.dumps(response_dict, indent=4)

@app.post("/advice/")
async def send_advice(user_input: AdviceInput):
    # Retrieve the chat history from MongoDB
    current_chat_id = user_input.chatId
    chat = chat_collection.find_one({"_id": ObjectId(current_chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Populate the chatHistory with paired messages
    chat_history = chat.get('chatHistory', [])
    
    # Create the conversation with existing context
    advice_convo = get_advice_convo(chat_history)

    # Send the user input to the model and get the response
    advice_convo.send_message(user_input.input_text)
    model_response = advice_convo.last.text

    followup_input = f"user question: {user_input.input_text}\nmodel response: {model_response}"

    followup_convo.send_message(followup_input)
    follow_up_questions = followup_convo.last.text

    follow_up_questions = follow_up_questions.split('?')
    follow_up_questions = [question.strip() for question in follow_up_questions if question.strip()]
    
    json_response = create_json_response(model_response, follow_up_questions)

    return json_response #use JSON.parse on the NextJS side to parse the json response

    # model_response = unescape_json(model_response)

    # return JSONResponse(content=jsonable_encoder(model_response))

# Commenting this out since we are already updating input-output message pairs on the NextJS side
# # Store the user input and model response in the database
# db.Chat.update_one({"_id": user_input.chatId}, {"$push": {"chatHistory": {"input": user_input.input_text, "response": model_response}}})

#this API endpoint prepares the news - for now, the news is prepared manually, but eventually this will be a function that executes at specific times of the day to prepare the news to be served.
@app.post("/prepare-news/")
async def get_news():
    #convo = classify_model.start_chat(history=[...])  # Initialize context for classification
    global prepared_headlines
    files = []
    for url in url_list:
        files.append(scrape(url))
    text = ""
    for file in files:
        with open(file, "r") as f:
            text += f.read()
    news_convo.send_message(text)
    model_response = news_convo.last.text
    prepared_headlines = model_response
    return model_response #returns the news

@app.post("/serve-news/")
async def send_news():
    headlines = prepared_headlines.split("\n")
    if headlines == ['']:
        headlines = ['No headlines found. Please try again later.']
    return {"received_news": headlines}

@app.post("/summarize-convo/")
async def summarize_convo(user_input: summarizeInput):
    messages = user_input.text
    summarizer_convo.send_message(messages)
    model_response = summarizer_convo.last.text
    return model_response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
