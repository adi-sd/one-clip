import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch, FaTimes } from "react-icons/fa"; // ✅ Added `FaTimes` for clearing
import { IoMdAddCircle } from "react-icons/io";

export default function ActionContainer({
    onCreateNote,
    onSearch,
}: {
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
        onSearch(""); // ✅ Show all notes again
    };

    return (
        <div className="w-full h-[80px] rounded-lg shadow-md bg-white px-4 py-3 flex gap-x-4">
            {/* Search Bar */}
            <div className="h-full w-fit flex rounded-lg focus:ring-2 focus-visible:ring-2 focus-within:ring-2 ring-gray-400">
                <Input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search notes..."
                    className="h-full w-[20rem] rounded-r-none focus:ring-0 focus-visible:ring-0 focus-within:ring-0"
                />

                <Button
                    variant={"outline"}
                    className="h-full border-l-0 rounded-l-none flex items-center justify-center"
                    onClick={searchQuery ? handleClearSearch : undefined} // ✅ Clears search when cross is clicked
                >
                    {searchQuery ? (
                        <FaTimes className="text-gray-500" /> // ✅ Show cross icon when searching
                    ) : (
                        <FaSearch className="text-gray-500" />
                    )}
                </Button>
            </div>

            {/* Create Note Button */}
            <Button
                onClick={onCreateNote}
                variant={"default"}
                className="h-full w-fit bg-green-500 rounded-full [&_svg]:size-6 py-2 px-3 ml-auto"
            >
                <div className="flex items-center gap-x-2">
                    <IoMdAddCircle size={25} />
                    <span className="text-lg font-semibold">New Note</span>
                </div>
            </Button>
        </div>
    );
}
