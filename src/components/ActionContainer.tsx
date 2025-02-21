import React, { ReactNode, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { IoMdAddCircle, IoMdDoneAll } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Divide } from "lucide-react";

const NoteTypes: {
    name: string;
    value: string;
    icon: ReactNode;
}[] = [
    {
        name: "Note Types",
        value: "placeholder",
        icon: <FaFilter className="text-gray-500"></FaFilter>,
    },
    {
        name: "All Notes",
        value: "all",
        icon: <IoMdDoneAll className="text-gray-500"></IoMdDoneAll>,
    },
    {
        name: "Deleted",
        value: "deleted",
        icon: <IoTrashBinOutline className="text-gray-500"></IoTrashBinOutline>,
    },
];

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

            {/* Filter By Note Type - Desktop*/}
            <Select>
                <SelectTrigger className="h-full w-[150px] flex rounded-full focus:ring-2 focus-visible:ring-2 focus-within:ring-2 focus:ring-gray-400 focus-visible:ring-gray-400  focus-within:ring-gray-400 border-l-0">
                    <SelectValue
                        placeholder={
                            <div className="p-2 flex items-center gap-x-3">
                                <FaFilter className="text-gray-500" />
                                <span>Note Type</span>
                            </div>
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {NoteTypes.filter((noteType) => noteType.value !== "placeholder").map((noteType) => (
                            <SelectItem key={noteType.value} value={noteType.value}>
                                <div className="p-2 flex items-center gap-x-3">
                                    {noteType.icon}
                                    <span>{noteType.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Create Note Button */}
            <Button
                onClick={onCreateNote}
                variant={"default"}
                className="h-full w-fit bg-green-500 rounded-full [&_svg]:size-6 px-3 md:py-2 md:px-3 ml-auto"
            >
                <div className="flex items-center gap-x-2">
                    <IoMdAddCircle />
                    {isLargeScreen ? <span className="text-small md:text-lg font-semibold">New Note</span> : null}
                </div>
            </Button>
        </Card>
    );
}
