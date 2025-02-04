import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaSearch } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

export default function ActionContainer({ onCreateNote }: { onCreateNote: () => void }) {
    return (
        <div className="w-full h-[80px] rounded-lg shadow-md bg-white px-4 py-3 flex gap-x-4">
            {/* Search Bar */}
            <div className="h-full w-fit flex rounded-lg focus:ring-2 focus-visible:ring-2 focus-within:ring-2 ring-gray-400">
                <Input
                    type="text"
                    name="search"
                    id="search"
                    className="h-full w-[20rem] rounded-r-none focus:ring-0 focus-visible:ring-0 focus-within:ring-0"
                />
                <Button variant={"outline"} className="h-full border-l-0 rounded-l-none">
                    <FaSearch className="text-gray-500" />
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
