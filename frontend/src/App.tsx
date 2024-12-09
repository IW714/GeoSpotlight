import { useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import SearchInterface from './components/SearchInterface';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

function App() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const mapContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null && map === null) {
      const initializeMap = new mapboxgl.Map({
        container: node,
        style: 'mapbox://styles/mapbox/standard',
        center: [0, 0],
        zoom: 1,
      });

      initializeMap.on('style.load', () => {
        initializeMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
      })
    
      initializeMap.on('load', () => {
        initializeMap.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512, 
            'maxzoom': 14
        });
        initializeMap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    
        initializeMap.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
      });

      setMap(initializeMap);

      return () => initializeMap.remove();
    }
  }, [map]);

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapContainerRef} className="h-screen w-screen" />
      {map && <SearchInterface map={map} />}
    </div>
  );
}

export default App;
