from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.services.events import get_events
from app.services.geocode import geocode_address

app = FastAPI()

# Configure CROS
origins = [
    "http://localhost:5173", # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"],    
)

@app.get("/search")
async def search_events(city: str):
    events_data = get_events(city)
    events_results = events_data.get('events_results', [])
    for event in events_results:
        address = ', '.join(event.get('address', []))
        coords = geocode_address(address)
        event['coordinates'] = coords
    return {'events': events_results}




# @app.get("/protected")
# def protected_route(user=Depends(verify_token)):
#     return {"message": f"Hello, {user['uid']}"}
