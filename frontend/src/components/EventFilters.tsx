import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";

interface EventFiltersProps {
    onApplyFilters: (dateFilter: string, numResults: number) => void;
    currentDateFilter: string;
    currentNumResults: number;
}

const EventFilters: React.FC<EventFiltersProps> = ({
    onApplyFilters,
    currentDateFilter,
    currentNumResults,
}) => {
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>(
        currentDateFilter
    );
    const [numResults, setNumResults] = useState<number>(currentNumResults);

    useEffect(() => {
        setSelectedDateFilter(currentDateFilter);
        setNumResults(currentNumResults);
    }, [currentDateFilter, currentNumResults]);

    const handleApplyFilters = () => {
        onApplyFilters(selectedDateFilter, numResults);
        setIsFilterDialogOpen(false);
    };

    return (
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">Filters</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>
                Select date range and number of results.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <div>
                <p className="text-sm font-medium">Date Range</p>
                <RadioGroup
                value={selectedDateFilter}
                onValueChange={(value) => setSelectedDateFilter(value)}
                >
                <div className="space-y-2 mt-2">
                    {[
                    { value: "date:today", label: "Today" },
                    { value: "date:tomorrow", label: "Tomorrow" },
                    { value: "date:week", label: "This Week" },
                    { value: "date:weekend", label: "This Weekend" },
                    { value: "date:next_week", label: "Next Week" },
                    { value: "date:month", label: "This Month" },
                    { value: "date:next_month", label: "Next Month" },
                    ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value.split(":")[1]} />
                        <label htmlFor={value.split(":")[1]}>{label}</label>
                    </div>
                    ))}
                </div>
                </RadioGroup>
            </div>
            <div>
                <p className="text-sm font-medium">Number of Results</p>
                <Select
                value={numResults.toString()}
                onValueChange={(value) => setNumResults(Number(value))}
                >
                <SelectTrigger className="w-full mt-2">
                    {numResults} Results
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10 Results</SelectItem>
                    <SelectItem value="20">20 Results</SelectItem>
                    <SelectItem value="30">30 Results</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            <DialogFooter>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
};

export default EventFilters;
