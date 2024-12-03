import { useRef, useCallback, useState } from 'react';
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
        style: 'mapbox://styles/ivanwuo/cm44kuip0003001rzawn307ij',
        center: [0, 0],
        zoom: 1,
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
