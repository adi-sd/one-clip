"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNotesStore } from "@/store/noteStore";
import { SortByTypesArray, SortByType, SortByKeys } from "@/types/sort";
import ToolbarButtonCombo from "@/components/toolbar/ToolbarButtonCombo";
import SortNotesTrigger from "@/components/action-container/SortNotesTrigger";

interface SortNotesButtonProps {
    defaultSortKey: SortByKeys;
}

export default function SortNotesButton({ defaultSortKey }: SortNotesButtonProps) {
    const { notes, sortFilteredNotes } = useNotesStore();
    const [currentSortKey, setCurrentSortKey] = useState<SortByKeys>(defaultSortKey);

    const handleSortChange = useCallback(
        (sortKey: SortByKeys) => {
            setCurrentSortKey(sortKey);
            sortFilteredNotes(sortKey);
        },
        [sortFilteredNotes]
    );

    useEffect(() => {
        handleSortChange(defaultSortKey);
    }, [defaultSortKey, handleSortChange, notes]);

    const options = SortByTypesArray.map((sortOption: SortByType) => ({
        icon: sortOption.icon,
        isActive: sortOption.key === currentSortKey,
        onClick: () => handleSortChange(sortOption.key),
        text: sortOption.text,
    }));

    return (
        <div className="h-full w-fit flex items-center justify-center">
            <ToolbarButtonCombo
                tooltip="Sort Notes"
                trigger={<SortNotesTrigger />}
                options={options}
                squareDrop
                disabled={notes.length === 0}
            />
        </div>
    );
}
