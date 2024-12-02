import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

const Globe = () => {
    useEffect(() => {
        if (!mapboxgl.accessToken) {
            console.error('Mapbox access token is not defined.');
            return;
        }

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/ivanwuo/cm44kuip0003001rzawn307ij',
            center: [0, 0],
            zoom: 1,
        });

        return () => map.remove();
    }, []);

    return <div id="map" className="h-screen w-screen" />;
}

export default Globe;