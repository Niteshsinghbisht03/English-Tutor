import os
import json
from typing import TypedDict
from langgraph.graph import END, StateGraph ,START
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from app.schemas.response import SentenceResponse
from dotenv import load_dotenv

# Define state
class TutorState(TypedDict):
    sentence: str
    result: str

load_dotenv()

# LLM Setup
llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash')

# Prompt
prompt = ChatPromptTemplate([
    ("system", "You are an English tutor."),
    ("human", "You have to Correct the incorrect sentence grammatically which is given below \n {sentence} and provide the answer in a single sentence which has correct sentence and the mistake in the original sentence.The correct sentence is going to be read by a voice assistant so do not use / or * or any other special characters which might break the voice assistant")
])

# Step function
def correct_and_feedback(state: TutorState) -> TutorState:
    chain = prompt | llm
    output = chain.invoke({"sentence": state["sentence"]})
    return {"sentence": state["sentence"], "result": output.content}

# Build LangGraph
builder = StateGraph(TutorState)
builder.add_node("correct", correct_and_feedback)
builder.add_edge(START,'correct')
builder.add_edge("correct", END)

app_graph = builder.compile()

def run_tutor_workflow(sentence: str) -> SentenceResponse:
    result = app_graph.invoke({"sentence": sentence})
    print(result)
    try:
        parsed = result["result"]
        return SentenceResponse(answer=parsed)
    except Exception:
        return SentenceResponse(
           answer="Sorry, there was an error parsing the model's response. Please try again."
        )