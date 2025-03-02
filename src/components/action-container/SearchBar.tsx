"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useScreenResize } from "@/hooks/useScreenResize";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
    searchQuery: string;
    onChange: (query: string) => void;
}

export default function SearchBar({ searchQuery, onChange }: SearchBarProps) {
    const { isLargeScreen } = useScreenResize();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleClearSearch = () => {
        onChange("");
    };

    return (
        <div className="h-full w-full flex rounded-full focus:ring-2 focus-visible:ring-2 focus-within:ring-2 ring-gray-400">
            <Input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search notes..."
                className="h-full w-full rounded-full rounded-r-none focus:ring-0 focus-visible:ring-0 focus-within:ring-0 font-semibold placeholder:text-sm flex justify-center items-center"
                style={isLargeScreen ? { fontSize: "0.875rem" } : {}}
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
