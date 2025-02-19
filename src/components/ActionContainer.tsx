import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch, FaTimes } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Card } from "@/components/ui/card";

export default function ActionContainer({
    isLargeScreen,
    onCreateNote,
    onSearch,
}: {
    isLargeScreen: boolean;
    onCreateNote: () => void;
    onSearch: (query: string) => void;
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
        <Card className="w-full h-[80px] rounded-lg shadow-sm md:shadow-md bg-white px-2 md:px-4 py-4 flex gap-x-2 md:gap-x-4 text-small md:text-lg border-gray-300">
            {/* Search Bar */}
            <div className="h-full w-full flex rounded-full focus:ring-2 focus-visible:ring-2 focus-within:ring-2 ring-gray-400 ">
                <Input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search notes..."
                    className="h-full w-full rounded-full rounded-r-none focus:ring-0 focus-visible:ring-0 focus-within:ring-0 font-semibold text-small placeholder:text-small md:placeholder:text-lg flex justify-center items-center md:pl-6"
                    style={isLargeScreen ? { fontSize: "1.125rem" } : { fontSize: "" }}
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

            {/* Create Note Button */}
            <Button
                onClick={onCreateNote}
                variant={"default"}
                className="h-full w-fit bg-green-500 rounded-full [&_svg]:size-6 px-2 md:py-2 md:px-3 ml-auto"
            >
                <div className="flex items-center gap-x-2">
                    <IoMdAddCircle />
                    {isLargeScreen ? <span className="text-small md:text-lg font-semibold">New Note</span> : null}
                </div>
            </Button>
        </Card>
    );
}
