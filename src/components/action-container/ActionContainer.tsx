import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/action-container/SearchBar";
import CreateNewNoteButton from "@/components/action-container/CreateNewNoteButton";
import { Note } from "@/types/note";
import SortNotesButton from "./SortNotesButton";
import { useNotesStore } from "@/store/noteStore";
import { SortByKeys, SortByType, SortByTypesArray } from "@/types/sort";
import SelectNotesButton from "@/components/action-container/SelectNotesButton";
// import NoteTypeFilter from "@/components/action-container/NoteTypeFilter";

interface ActionContainerProps {
    setFilteredNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function ActionContainer({ setFilteredNotes }: ActionContainerProps) {
    const { notes } = useNotesStore();

    // Local state for search query and sort key.
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentSortKey, setCurrentSortKey] = useState<SortByKeys>("created-at-new-old");

    useEffect(() => {
        // Filter notes based on the search query.
        const filtered = searchQuery.trim()
            ? notes.filter(
                  (note) =>
                      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      note.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : notes;
        // Find the sort option corresponding to the current sort key.
        const sortOption = SortByTypesArray.find((opt: SortByType) => opt.key === currentSortKey);
        if (sortOption) {
            const sorted = [...filtered].sort(sortOption.compareFunction);
            setFilteredNotes(sorted);
        } else {
            setFilteredNotes(filtered);
        }
    }, [notes, searchQuery, currentSortKey, setFilteredNotes]);

    return (
        <Card className="w-full h-[80px] rounded-lg shadow-sm md:shadow-md bg-white px-2 md:px-4 py-4 flex gap-x-2 md:gap-x-4 text-sm md:text-lg border-gray-300">
            {/* Search Bar */}
            <SearchBar searchQuery={searchQuery} onChange={setSearchQuery}></SearchBar>

            {/* Filter By Note Type - Desktop*/}
            {/* <NoteTypeFilter /> */}

            {/* Sort By NOte*/}
            <SortNotesButton defaultSortKey="created-at-new-old" onSortChange={setCurrentSortKey} />

            {/* Select Note Button */}
            <SelectNotesButton />

            {/* Create Note Button */}
            <CreateNewNoteButton />
        </Card>
    );
}
