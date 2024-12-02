import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

const SearchInterface = () => { 
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermResults, setSearchTermResults] = useState(null);

    const handleSearch = async () => {
        
        try {
            const response = await fetch('http://http://127.0.0.1:8000', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({searchTerm}),
            });

            const data = await response.json();

            setSearchTermResults(data);
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                    <CardDescription>Search for events in a City</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    {/* TODO: placeholder city should be determined based on geocode of user IP address*/}
                    <Input type="search" placeholder="user city" /> 
                    <Button type="submit" onClick={handleSearch}>Search</Button>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SearchInterface;