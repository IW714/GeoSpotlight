import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import mapboxgl from "mapbox-gl";

interface EventItem {
  title: string;
  date: {
    start_date: string;
    when: string;
  }
  thumbnail?: string;
  coordinates?: [number, number];
}

interface SearchResultsProps {
  events: EventItem[];
  searchTerm: string;
  map: mapboxgl.Map | null;
  onHide: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ events, searchTerm, map, onHide }) => {
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
            {events.map((event, index) => (
              <li
                key={index}
                className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
                onClick={() => {
                  if (event.coordinates && map) {
                    map.flyTo({
                      center: event.coordinates,
                      zoom: 15,
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
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResults;