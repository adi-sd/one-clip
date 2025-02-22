import React from "react";
// import {IoMdDoneAll } from "react-icons/io";
// import { IoTrashBinOutline } from "react-icons/io5";
import { Card } from "@/components/ui/card";
import SearchBar from "./SearchBar";
import { FaPlus } from "react-icons/fa";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const NoteTypes: {
//     name: string;
//     value: string;
//     icon: ReactNode;
// }[] = [
//     {
//         name: "Note Types",
//         value: "placeholder",
//         icon: <FaFilter className="text-gray-500"></FaFilter>,
//     },
//     {
//         name: "All Notes",
//         value: "all",
//         icon: <IoMdDoneAll className="text-gray-500"></IoMdDoneAll>,
//     },
//     {
//         name: "Deleted",
//         value: "deleted",
//         icon: <IoTrashBinOutline className="text-gray-500"></IoTrashBinOutline>,
//     },
// ];

export default function ActionContainer({
    isLargeScreen,
    onCreateNote,
    onSearch,
}: {
    isLargeScreen: boolean;
    onCreateNote: () => void;
    onSearch: (query: string) => void;
}) {
    return (
        <Card className="w-full h-[80px] rounded-lg shadow-sm md:shadow-md bg-white px-2 md:px-4 py-4 flex gap-x-2 md:gap-x-4 text-sm md:text-lg border-gray-300">
            {/* Search Bar */}
            <SearchBar onSearch={onSearch} isLargeScreen={isLargeScreen}></SearchBar>

            {/* Filter By Note Type - Desktop*/}
            {/* <Select>
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
            </Select> */}

            {/* Create Note Button */}
            <button
                onClick={onCreateNote}
                className="h-full w-fit bg-green-500 p-3 md:px-3 md:py-0 rounded-full ml-auto"
            >
                <div className="flex items-center justify-center gap-x-2 text-white">
                    {isLargeScreen ? <FaPlus size={18} /> : <FaPlus size={20} />}
                    {isLargeScreen ? <span className="h-full text-sm font-semibold text-nowrap">New Note</span> : null}
                </div>
            </button>
        </Card>
    );
}
