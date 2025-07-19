from pydantic import BaseModel

class SentenceResponse(BaseModel):
    answer:str