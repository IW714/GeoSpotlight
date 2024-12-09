import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X as LucideX } from 'lucide-react';

interface SavedEventItem {
    id: number;
    title: string;
    coordinates?: [number, number];
    date: {
        start_date: string;
        when: string;
    };
    thumbnail?: string;
}

interface SavedEventsProps {
    events: SavedEventItem[];
    map: mapboxgl.Map | null;
    onHide: () => void;
    onDeleteEvent: (event: SavedEventItem) => void;
}

const SavedEvents: React.FC<SavedEventsProps> = ({ events, map, onHide, onDeleteEvent }) => {
    return (
        <div 
            className="fixed bottom-10 left-10 z-20 w-80 transition-all duration-300 ease-in-out"
        >
            <Card className="max-h-[70vh] flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <CardTitle>Saved Events</CardTitle>
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
                        {events.map((event, index) => (
                            <li
                                key={event.id || index}
                                className="relative flex items-center hover:bg-gray-100 p-2 rounded-md transition-colors"
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
                                {event.thumbnail && (
                                    <img
                                        src={event.thumbnail}
                                        alt={event.title}
                                        className="w-16 h-16 object-cover mr-4 rounded-md"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold">{event.title}</div>
                                    <div className="text-sm text-gray-500">{event.date.when}</div>
                                </div>
                                <div className="absolute bottom-1 right-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="bg-black border border-white rounded-full flex items-center justify-center w-8 h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteEvent(event);
                                        }}
                                    >
                                        <LucideX className="text-gray-400 w-5 h-5" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default SavedEvents;
