import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import SearchResults from "./SearchResults";
import EventFilters from "./EventFilters";
import SavedEvents from "./SavedEvents";

interface EventItem {
    title: string;
    date: {
        start_date: string;
        when: string;
    }
    thumbnail?: string;
    coordinates?: [number, number];
    id?: number;
}

interface SavedEventItem extends EventItem {
    id: number;
}

interface SearchInterfaceProps {
    map: mapboxgl.Map;
}

function getEventKey(event: EventItem) {
    return event.title + ':' + event.date.start_date;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ map }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermResults, setSearchTermResults] = useState<EventItem[]>([]);
    const [isResultsVisible, setIsResultsVisible] = useState(false);

    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const displayedMarkers = useRef<Set<string>>(new Set());
    
    const [savedEvents, setSavedEvents] = useState<SavedEventItem[]>([]);
    const [isSavedEventsVisible, setIsSavedEventsVisible] = useState(false);

    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("date:today");
    const [numResults, setNumResults] = useState<number>(10);

    const savedKeys = useRef<Set<string>>(new Set());
    const nonSavedMarkersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        fetchSavedEvents();
    }, []);

    const createDefaultMarker = () => {
        const el = document.createElement('div');
        el.style.width = '25px';
        el.style.height = '25px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'black';
        el.style.border = '1px solid white';
        return el;
    };

    const createHeartMarker = () => {
        const el = document.createElement('div');
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'black';
        el.style.border = '1px solid white';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'red';
        el.style.fontSize = '14px';
        el.innerText = '♥';
        return el;
    };

    const fetchSavedEvents = async () => {
        const response = await fetch('http://127.0.0.1:8000/saved_events', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            const data = await response.json();
            setSavedEvents(data.events);
            savedKeys.current.clear();
            data.events.forEach((ev: SavedEventItem) => {
                const key = getEventKey(ev);
                savedKeys.current.add(key);
            });

            const existingMarkers = markersRef.current;
            existingMarkers.forEach(m => {
                // do nothing
            });

            // Ensure heart markers are displayed for all saved events
            data.events.forEach((event: SavedEventItem) => {
                if (event.coordinates) {
                    const key = getEventKey(event);
                    if (!displayedMarkers.current.has(key)) {
                        const markerElement = createHeartMarker();
                        const marker = new mapboxgl.Marker({ element: markerElement })
                            .setLngLat(event.coordinates)
                            .setPopup(new mapboxgl.Popup().setText(event.title))
                            .addTo(map);
                        displayedMarkers.current.add(key);
                        markersRef.current.push(marker);
                    } else {
                        // If a default marker was there for a saved event, remove it and replace with heart
                        const idx = markersRef.current.findIndex(m => {
                            const pp = m.getPopup();
                            return pp && pp.getText() === event.title;
                        });
                        if (idx !== -1) {
                            const oldMarker = markersRef.current[idx];
                            oldMarker.remove();
                            markersRef.current.splice(idx,1);
                            const markerElement = createHeartMarker();
                            const marker = new mapboxgl.Marker({ element: markerElement })
                                .setLngLat(event.coordinates)
                                .setPopup(new mapboxgl.Popup().setText(event.title))
                                .addTo(map);
                            markersRef.current.push(marker);
                        }
                    }
                }
            });

        } else {
            console.error('Failed to fetch saved events');
        }
    };

    const handleSearch = async () => {
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
            setSearchTermResults(data.events || []);
            
            nonSavedMarkersRef.current.forEach(m => m.remove());
            nonSavedMarkersRef.current = [];

            (data.events || []).forEach((event: EventItem) => {
                const key = getEventKey(event);
                const isSaved = savedKeys.current.has(key);
                if (event.coordinates && !isSaved && !displayedMarkers.current.has(key)) {
                    const markerElement = createDefaultMarker();
                    const marker = new mapboxgl.Marker({ element: markerElement })
                        .setLngLat(event.coordinates)
                        .setPopup(new mapboxgl.Popup().setText(event.title))
                        .addTo(map);
                    displayedMarkers.current.add(key);
                    nonSavedMarkersRef.current.push(marker);
                    markersRef.current.push(marker);
                }
            });
            
            if (data.events && data.events.length > 0 && data.events[0].coordinates) {
                map.flyTo({
                    center: data.events[0].coordinates,
                    zoom: 16,
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

    const handleToggleSavedEvents = () => {
        setIsSavedEventsVisible(prev => !prev);
    };

    const toggleSaveEvent = async (event: EventItem) => {
        const key = getEventKey(event);
        const isSaved = savedKeys.current.has(key);
        if (!isSaved) {
            const response = await fetch('http://127.0.0.1:8000/save_event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
            if (response.ok) {
                await fetchSavedEvents();
            } else {
                console.error('Failed to save event');
            }
        } else {
            const savedEv = savedEvents.find(ev => getEventKey(ev) === key);
            if (savedEv && savedEv.id) {
                const response = await fetch(`http://127.0.0.1:8000/delete_event/${savedEv.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await fetchSavedEvents();
                } else {
                    console.error('Failed to delete event');
                }
            }
        }
    };

    const onDeleteEvent = async (event: SavedEventItem) => {
        const response = await fetch(`http://127.0.0.1:8000/delete_event/${event.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            await fetchSavedEvents();
        } else {
            console.error('Failed to delete event');
        }
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
                            <Button 
                                variant="outline"
                                onClick={handleToggleSavedEvents}
                            >
                                Saved
                            </Button>
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
                    onToggleSave={toggleSaveEvent}
                    savedEvents={savedEvents}
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

            {isSavedEventsVisible && savedEvents.length > 0 && (
                <SavedEvents
                    events={savedEvents}
                    map={map}
                    onHide={handleToggleSavedEvents}
                    onDeleteEvent={onDeleteEvent}
                />
            )}
        </>
    );
};

export default SearchInterface;
