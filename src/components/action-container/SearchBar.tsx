import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({
    onSearch,
    isLargeScreen,
}: {
    onSearch: (query: string) => void;
    isLargeScreen: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    // ✅ Clears search box & resets notes
    const handleClearSearch = () => {
        setSearchQuery("");
        onSearch("");
    };

    return (
        <div className="h-full w-full flex rounded-full focus:ring-2 focus-visible:ring-2 focus-within:ring-2 ring-gray-400 ">
            <Input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search notes..."
                className="h-full w-full rounded-full rounded-r-none focus:ring-0 focus-visible:ring-0 focus-within:ring-0 font-semibold placeholder:text-sm flex justify-center items-center"
                style={isLargeScreen ? { fontSize: "0.875rem" } : { fontSize: "" }}
                autoComplete="off"
            />
            <Button
                variant={"outline"}
                className="h-full border-l-0 rounded-full rounded-l-none flex items-center justify-center"
                onClick={searchQuery ? handleClearSearch : undefined}
            >
                {searchQuery ? <FaTimes className="text-gray-500" /> : <FaSearch className="text-gray-500" />}
            </Button>
        </div>
    );
}
