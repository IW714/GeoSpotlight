import aiohttp
import urllib.parse
import os

MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")

async def geocode_address(address):
    encoded_address = urllib.parse.quote(address)
    url = f'https://api.mapbox.com/geocoding/v5/mapbox.places/{encoded_address}.json?access_token={MAPBOX_ACCESS_TOKEN}'
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            if data['features']:
                return data['features'][0]['geometry']['coordinates']  # [lng, lat]
            else:
                return None