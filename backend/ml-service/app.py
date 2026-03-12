from fastapi import FastAPI
from pydantic import BaseModel
from recommendation import recommend_by_mood

app = FastAPI()

class Mood(BaseModel):
    name:str

@app.post("/songs")
async def get_songs(data: Mood):
    song_list = recommend_by_mood(data.name)
    if isinstance(song_list, str):
        return []
    return song_list.to_dict(orient="records")