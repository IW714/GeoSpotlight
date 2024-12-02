import mapboxgl from "mapbox-gl";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

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
        <div className="relative">
            <Card className="w-80">
                <CardHeader>
                    <CardTitle>Events in {searchTerm}</CardTitle>
                    <Button variant="ghost" className="absolute top-2 right-2" onClick={onHide}>Hide</Button>
                </CardHeader>
                <CardContent>
                    <ul>
                        {events.map((event, index) => (
                            <li
                                key={index}
                                className="flex items-center mb-4 cursor-pointer"
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
                                className="w-16 h-16 object-cover mr-4"
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