import React, { useState } from "react";
import ToolbarButtonCombo from "@/components/toolbar/ToolbarButtonCombo";
import { useNotesStore } from "@/store/noteStore";
import SelectNotesTrigger from "@/components/action-container/SelectNotesTrigger";
import { ToolbarButtonComboOptionType } from "@/types/toolbar";
import { MdClear } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SelectNotesButton() {
    const { filteredNotes, selectedNotes, addSelectedNote, removeSelectedNote, deleteSelected } = useNotesStore();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const confirmationMessage =
        filteredNotes.length === selectedNotes.size
            ? "Are you sure you want to delete all notes?"
            : "Are you sure you want to delete the selected notes?";

    const SelectNotesOptions: ToolbarButtonComboOptionType[] = [
        {
            icon: <IoCheckmarkDoneSharp size={14} />,
            onClick: () => {
                // "Select All": iterate through all notes and add their ids
                filteredNotes.forEach((filteredNotes) => addSelectedNote(filteredNotes.id));
            },
            isActive: filteredNotes.length === selectedNotes.size,
            text: "Select All Notes",
            disabled: filteredNotes.length === 0,
        },
        {
            icon: <MdClear size={14} />,
            onClick: () => {
                // "Clear Selection": remove all selected note ids
                Array.from(selectedNotes).forEach((noteId) => removeSelectedNote(noteId));
            },
            isActive: false,
            text: "Clear Selection",
            disabled: selectedNotes.size === 0,
        },
        {
            icon: <FaTrash size={14} />,
            onClick: () => {
                // Open the confirmation dialog instead of using window.confirm
                setConfirmOpen(true);
            },
            isActive: false,
            text: filteredNotes.length === selectedNotes.size ? "Delete All" : "Delete Selected",
            disabled: selectedNotes.size === 0,
        },
    ];

    const handleConfirmDelete = async () => {
        await deleteSelected();
        setConfirmOpen(false);
    };

    return (
        <>
            <div className="h-full w-fit flex items-center justify-center">
                <ToolbarButtonCombo
                    tooltip="Sort Notes"
                    trigger={<SelectNotesTrigger />}
                    options={SelectNotesOptions}
                    squareDrop
                    disabled={filteredNotes.length === 0}
                />
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-gray-400">Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 font-bold">{confirmationMessage}</p>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                        <button
                            className="px-4 py-2 bg-black text-white font-bold rounded"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
