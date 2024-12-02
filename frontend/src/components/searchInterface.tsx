import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import SearchResults from "./SearchResults";

interface SearchInterfaceProps {
    map: mapboxgl.Map | null;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ map }) => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermResults, setSearchTermResults] = useState<any[]>([]);
    const [isResultsVisible, setIsResultsVisible] = useState(true);

    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const handleSearch = async () => {
        if (!map) {
            console.error('Map is not initialized yet.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/search?city=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setSearchTermResults(data.events);
            // DEBUG: console.log(searchTermResults);

            markersRef.current.forEach((marker) => {
                marker.remove();
            });
            markersRef.current = [];
            
            data.events.forEach((event: any) => {
                if (event.coordinates && map) {
                    new mapboxgl.Marker()
                        .setLngLat(event.coordinates)
                        .setPopup(new mapboxgl.Popup().setText(event.title))
                        .addTo(map);
                }
            })

            // TODO: Need to change to the city coords instead of the first event
            if (data.events.length > 0 && data.events[0].coordiantes) {
                map.flyTo({
                    center: data.events[0].coordinates,
                    zoom: 10,
                    essential: true,
                });
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleHideResults = () => {
        setIsResultsVisible(false);
    }

    const handleShowResults = () => {
        setIsResultsVisible(true);
    }

    return (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <Card>
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                    <CardDescription>Search for events in a City</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    {/* TODO: placeholder city should be determined based on geocode of user IP address*/}
                    <Input type="search" placeholder="user city" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/> 
                    <Button type="submit" onClick={handleSearch}>Search</Button>
                </div>
                </CardContent>
            </Card>
            {isResultsVisible && searchTermResults.length > 0 && (
                <div className="ml-4">
                    <SearchResults
                        events={searchTermResults}
                        searchTerm={searchTerm}
                        map={map}
                        onHide={handleHideResults}
                    />
                </div>
            )}
            {!isResultsVisible && searchTermResults.length > 0 && (
                <Button 
                    onClick={handleShowResults}
                    className="ml-4 mt-4"
                >
                    Show Results
                </Button>
            )}
        </div>
    )
}

export default SearchInterface;