import requests
import os
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def get_events(city):
    print(SERPAPI_KEY)
    params = {
        'engine': 'google_events',
        'q': f'events in {city}',
        'api_key': SERPAPI_KEY,
    }
    # TODO: Include advanced filteres in params for date, localization, and pagination. 
    # TODO: Implement solution for cities with duplication names (maybe autofill in frontend)
    response = requests.get('https://serpapi.com/search.json', params=params)
    # print(response.url)
    # print(response.json())
    

    return response.json()


