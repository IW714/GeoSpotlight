import requests
import os
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def get_events(
        city: str,
        date_filters: list = None,
        country_code: str = None,
        language_code: str = None,
        num_pages: int = 1
        ):
    if not SERPAPI_KEY:
        raise ValueError('No API key found for SerpApi')
    
    all_events = []

    params = {
        'engine': 'google_events',
        'q': f'events in {city}',
        'api_key': SERPAPI_KEY,
    }

    if country_code:
        params['gl'] = country_code
    if language_code:
        params['hl'] = language_code

    if date_filters:
        params['htichips'] = ",".join(date_filters)

    for page in range(num_pages):
        params['start'] = page * 10

        try:
            response = requests.get('https://serpapi.com/search.json', params=params)
            response.raise_for_status()
            data = response.json()

            events = data.get('events_results', [])
            if not events: 
                print(f"No events found on page {page + 1}.")
                break
                
            all_events.extend(events)

        except requests.RequestException as e:
            print(f'Error fetching events for page {page + 1}: {e}')
            break
    
    # TODO: Implement solution for cities with duplication names (maybe autofill in frontend)
    return {'events': all_events}


