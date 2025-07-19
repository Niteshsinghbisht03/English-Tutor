from pydantic import BaseModel

class SentenceRequest(BaseModel):
    sentence: str