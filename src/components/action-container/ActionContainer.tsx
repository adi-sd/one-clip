import React from "react";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/action-container/SearchBar";
import CreateNewNoteButton from "@/components/action-container/CreateNewNoteButton";
import { Note } from "@/types/note";
// import NoteTypeFilter from "@/components/action-container/NoteTypeFilter";

interface ActionContainerProps {
    setFilteredNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function ActionContainer({ setFilteredNotes }: ActionContainerProps) {
    return (
        <Card className="w-full h-[80px] rounded-lg shadow-sm md:shadow-md bg-white px-2 md:px-4 py-4 flex gap-x-2 md:gap-x-4 text-sm md:text-lg border-gray-300">
            {/* Search Bar */}
            <SearchBar setFilteredNotes={setFilteredNotes}></SearchBar>

            {/* Filter By Note Type - Desktop*/}
            {/* <NoteTypeFilter /> */}

            {/* Create Note Button */}
            <CreateNewNoteButton />
        </Card>
    );
}
