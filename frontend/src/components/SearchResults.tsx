import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, HeartOff } from 'lucide-react';

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

interface SearchResultsProps {
    events: EventItem[];
    searchTerm: string;
    map: mapboxgl.Map | null;
    onHide: () => void;
    onToggleSave: (event: EventItem) => void;
    savedEvents: {id:number; title:string; date:{start_date:string; when:string}}[];
}

function getEventKey(event: EventItem) {
    return event.title + ':' + event.date.start_date;
}

const SearchResults: React.FC<SearchResultsProps> = ({ events, searchTerm, map, onHide, onToggleSave, savedEvents }) => {
    // Create a set of keys for saved events for quick lookup
    const savedKeys = new Set<string>();
    savedEvents.forEach(ev => {
        const k = ev.title + ':' + ev.date.start_date;
        savedKeys.add(k);
    });

    return (
        <div 
            className="fixed bottom-10 right-10 z-20 w-80 transition-all duration-300 ease-in-out"
        >
            <Card className="max-h-[70vh] flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <CardTitle>Events in {searchTerm}</CardTitle>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={onHide}
                        >
                            ✕
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto">
                    <ul className="space-y-4">
                        {events.map((event, index) => {
                            const key = getEventKey(event);
                            const isSaved = savedKeys.has(key);
                            return (
                            <li
                                key={index}
                                className="relative flex items-center hover:bg-gray-100 p-2 rounded-md transition-colors"
                            >
                                {event.thumbnail && (
                                    <img
                                        src={event.thumbnail}
                                        alt={event.title}
                                        className="w-16 h-16 object-cover mr-4 rounded-md"
                                    />
                                )}
                                <div className="flex-grow cursor-pointer"
                                    onClick={() => {
                                        if (event.coordinates && map) {
                                            map.flyTo({
                                                center: event.coordinates,
                                                zoom: 16,
                                                essential: true,
                                            });
                                        }
                                    }}
                                >
                                    <div className="font-semibold">{event.title}</div>
                                    <div className="text-sm text-gray-500">{event.date.when}</div>
                                </div>
                                <div className="absolute bottom-1 right-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="bg-black border border-white rounded-full flex items-center justify-center w-7 h-7"
                                        onClick={() => onToggleSave(event)}
                                    >
                                        {isSaved ? <HeartOff className="text-gray-500 w-5 h-5" fill="grey"/> : <Heart className="text-red-500 w-5 h-5" fill="red"/>}
                                    </Button>
                                </div>
                            </li>
                        )})}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchResults;
