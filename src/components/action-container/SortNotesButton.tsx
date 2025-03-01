import React, { useState, useEffect } from "react";
import { useNotesStore } from "@/store/noteStore";
import { SortByTypesArray, SortByType, SortByKeys } from "@/types/sort";
import { FaSort } from "react-icons/fa";
import ToolbarButtonCombo from "@/components/toolbar/ToolbarButtonCombo";
import { Note } from "@/types/note";

interface SortNotesButtonProps {
    setFilteredNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    defaultSortKey: SortByKeys;
}

export default function SortNotesButton({ setFilteredNotes, defaultSortKey }: SortNotesButtonProps) {
    // Retrieve the current notes from the store.
    const { notes } = useNotesStore();
    // Use the provided defaultSortKey to initialize the active sort option.
    const [currentSortKey, setCurrentSortKey] = useState<SortByKeys>(defaultSortKey);

    // When a sort option is selected, update the sort key and sort the notes.
    const handleSortChange = (sortKey: SortByKeys) => {
        setCurrentSortKey(sortKey);
        // Find the corresponding sort option.
        const sortOption = SortByTypesArray.find((opt: SortByType) => opt.key === sortKey);
        if (sortOption) {
            // Sort a copy of the notes using the compare function.
            const sortedNotes = [...notes].sort(sortOption.compareFunction);
            setFilteredNotes(sortedNotes);
        }
    };

    // On mount, apply the default sort order.
    useEffect(() => {
        handleSortChange(defaultSortKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSortKey, notes]);

    // Map sort options for the ToolbarButtonCombo.
    const options = SortByTypesArray.map((sortOption: SortByType) => ({
        icon: sortOption.icon,
        isActive: sortOption.key === currentSortKey,
        onClick: () => handleSortChange(sortOption.key),
        text: sortOption.text,
    }));

    return (
        <div className="h-full flex items-center justify-center">
            <ToolbarButtonCombo
                tooltip="Sort Notes"
                trigger={<FaSort size={20} />}
                options={options}
                squareDrop
                disabled={notes.length === 0}
            />
        </div>
    );
}
