from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from supabase import create_client, Client
from urllib.parse import unquote
import os
import asyncio

from app.services.events import get_events
from app.services.geocode import geocode_address

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

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.post("/save_event")
async def save_event(event: dict):
    data = {
        "title": event.get("title"),
        "coordinates": event.get("coordinates"), # store as [lng, lat]
        "date_start": event["date"]["start_date"],
        "date_when": event["date"]["when"],
        "thumbnail": event.get("thumbnail")
    }
    
    try:
        response = supabase.table("saved_events").insert(data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Event saved"}

@app.get("/saved_events")
async def get_saved_events():
    try:
        response = supabase.table("saved_events").select("*").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    events = response.data or []
    formatted_events = []
    for e in events:
        formatted_events.append({
            "id": e["id"],
            "title": e["title"],
            "coordinates": e["coordinates"], 
            "date": {
                "start_date": e["date_start"],
                "when": e["date_when"]
            },
            "thumbnail": e["thumbnail"]
        })
    return {"events": formatted_events}

@app.delete("/delete_event/{event_id}")
async def delete_event(event_id: int):
    try:
        response = supabase.table("saved_events").delete().eq("id", event_id).execute()
        return {"message": "Event deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/search")
async def search_events(
    city: str,
    date_filters: Optional[str] = None,
    country_code: Optional[str] = None,
    language_code: Optional[str] = None,
    num_pages: Optional[int] = 1
    ):
    """
    Search for events in a given city, geocode their addresses, and return the events with coordinates.

    Args:
        city (str): The name of the city to search for events.
        date_filters (str, optional): Comma-separated date filters.
        country_code (str, optional): Two-letter country code.
        language_code (str, optional): Two-letter language code.
        num_pages (int, optional): Number of pages to fetch (10 events each).

    Returns:
        dict: JSON response containing a list of events with coordinates.
    """
    date_filters_list = date_filters.split(',') if date_filters else None

    events_data = get_events(
        city=city,
        date_filters=date_filters_list,
        country_code=country_code,
        language_code=language_code,
        num_pages=num_pages
        )
    
    events_results = events_data.get('events', [])
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
