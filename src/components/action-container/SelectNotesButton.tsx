import ToolbarButtonCombo from "@/components/toolbar/ToolbarButtonCombo";
import { useNotesStore } from "@/store/noteStore";
import SelectNotesTrigger from "@/components/action-container/SelectNotesTrigger";
import { ToolbarButtonComboOptionType } from "@/types/toolbar";
import { MdClear } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function SelectNotesButton() {
    const { notes, selectedNotes, addSelectedNote, removeSelectedNote } = useNotesStore();

    const SelectNotesOptions: ToolbarButtonComboOptionType[] = [
        {
            icon: <IoCheckmarkDoneSharp size={14} />,
            onClick: () => {
                // "Select All": iterate through all notes and add their ids
                notes.forEach((note) => addSelectedNote(note.id));
            },
            isActive: notes.length === selectedNotes.size,
            text: "Select All Notes",
            disabled: notes.length === 0,
        },
        {
            icon: <MdClear size={14} />,
            onClick: () => {
                // "Clear Selection": remove all selected note ids
                Array.from(selectedNotes).forEach((noteId) => removeSelectedNote(noteId));
            },
            isActive: selectedNotes.size > 0,
            text: "Clear Selection",
            disabled: selectedNotes.size === 0,
        },
    ];

    return (
        <div className="h-full w-fit flex items-center justify-center">
            <ToolbarButtonCombo
                tooltip="Sort Notes"
                trigger={<SelectNotesTrigger />}
                options={SelectNotesOptions}
                squareDrop
                disabled={notes.length === 0}
            />
        </div>
    );
}
