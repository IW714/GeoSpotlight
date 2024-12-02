import React, { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

import SearchResults from "./SearchResults";
import EventFilters from "./EventFilters";

interface SearchInterfaceProps {
    map: mapboxgl.Map;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ map }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermResults, setSearchTermResults] = useState<any[]>([]);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    // Filters
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("date:today");
    const [numResults, setNumResults] = useState<number>(10);

    const handleSearch = async () => {
        // if (!map) {
        //   console.error('Map is not initialized yet.');
        //   return;
        // }
        
        try {
            const dateFilters = [selectedDateFilter];
            const numPages = numResults / 10;

            const params = new URLSearchParams({
                city: searchTerm,
                num_pages: numPages.toString(),
                date_filters: dateFilters.join(","),
            });
            
        
            const response = await fetch(`http://127.0.0.1:8000/search?${params.toString()}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setSearchTermResults(data.events);
            
            // Remove existing markers
            markersRef.current.forEach((marker) => {
                marker.remove();
            });
            markersRef.current = [];
            
            // Add new markers
            data.events.forEach((event: any) => {
                if (event.coordinates) {
                const marker = new mapboxgl.Marker()
                    .setLngLat(event.coordinates)
                    .setPopup(new mapboxgl.Popup().setText(event.title))
                    .addTo(map);
                
                markersRef.current.push(marker);
                }
            });
            
            // Fly to the first event's coordinates
            if (data.events.length > 0 && data.events[0].coordinates) {
                map.flyTo({
                center: data.events[0].coordinates,
                zoom: 10,
                essential: true,
                });
            }
            
            setIsResultsVisible(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApplyFilters = (dateFilter: string, resultsNum: number) => {
        setSelectedDateFilter(dateFilter);
        setNumResults(resultsNum);
    }

    const handleHideResults = () => {
        setIsResultsVisible(false);
    };

    const handleShowResults = () => {
        setIsResultsVisible(true);
    };

    return (
        <>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <Card>
            <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>Search for events in a City</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                type="search" 
                placeholder="Enter city" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" onClick={handleSearch}>Search</Button>
                <EventFilters
                    onApplyFilters={handleApplyFilters}
                    currentDateFilter={selectedDateFilter}
                    currentNumResults={numResults}
                />
            </div>
            </CardContent>
        </Card>
        </div>

        {isResultsVisible && searchTermResults.length > 0 && (
            <SearchResults
            events={searchTermResults}
            searchTerm={searchTerm}
            map={map}
            onHide={handleHideResults}
            />
        )}
        
        {!isResultsVisible && searchTermResults.length > 0 && (
            <Button
            onClick={handleShowResults}
            className="fixed bottom-10 right-10 z-20"
            >
            Show Results
            </Button>
        )}
        </>
    );
};

export default SearchInterface;