from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.events import get_events
from app.services.geocode import geocode_address
import asyncio

app = FastAPI()

# Configure CROS
origins = [
    "http://localhost",
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
    """
    Search for events in a given city, geocode their addresses, and return the events with coordinates.

    Args:
        city (str): The name of the city to search for events.

    Returns:
        dict: A dictionary containing a list of events with their coordinates.
    """
    events_data = get_events(city)
    events_results = events_data.get('events_results', [])
    if not events_results:
        return {'events': []}
    
    addresses = [', '.join(event.get('address', [])) for event in events_results]
    tasks = [geocode_address(address) for address in addresses]
    coordinates_list = await asyncio.gather(*tasks)
    
    for event, coords in zip(events_results, coordinates_list):
        event['coordinates'] = coords

    return {'events': events_results}


# @app.get("/protected")
# def protected_route(user=Depends(verify_token)):
#     return {"message": f"Hello, {user['uid']}"}
