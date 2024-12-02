import requests
import os

MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")

def geocode_address(address):
    url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{requests.utils.quote(address)}.json'
    params = {'access_token': MAPBOX_ACCESS_TOKEN}
    response = requests.get(url, params=params)
    data = response.json()
    if data['features']:
        return data['features'][0]['geometry']['coordinates']  # [lng, lat]
    else:
        return None