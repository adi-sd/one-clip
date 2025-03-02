"use client";

import React, { useState, useEffect } from "react";
import { useNotesStore } from "@/store/noteStore";
import { SortByTypesArray, SortByType, SortByKeys } from "@/types/sort";
import ToolbarButtonCombo from "@/components/toolbar/ToolbarButtonCombo";
import SortNotesTrigger from "@/components/action-container/SortNotesTrigger";

interface SortNotesButtonProps {
    defaultSortKey: SortByKeys;
    onSortChange: (sortKey: SortByKeys) => void;
}

export default function SortNotesButton({ defaultSortKey, onSortChange }: SortNotesButtonProps) {
    const { notes } = useNotesStore();
    const [currentSortKey, setCurrentSortKey] = useState<SortByKeys>(defaultSortKey);

    const handleSortChange = (sortKey: SortByKeys) => {
        setCurrentSortKey(sortKey);
        onSortChange(sortKey);
    };

    // On mount, apply the default sort order.
    useEffect(() => {
        handleSortChange(defaultSortKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSortKey, notes]);

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
