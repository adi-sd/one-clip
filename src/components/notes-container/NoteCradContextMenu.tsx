import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { NoteCardActionType } from "./NoteCard";
import { Note } from "@/types/note";
import { useNotesStore } from "@/store/noteStore";
import { useScreenResize } from "@/hooks/useScreenResize";

interface NoteCardContextMenuProps {
    currentNote: Note;
    handleButtonClick: (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        action: NoteCardActionType
    ) => void;
}

export default function NoteCardContextMenu({ currentNote, handleButtonClick }: NoteCardContextMenuProps) {
    const { updateNoteFlag, addSelectedNote, removeSelectedNote, isSelectedNote } = useNotesStore();
    const { isLargeScreen } = useScreenResize();

    // Dedicated handler for toggling the copy flag.
    const handleToggleCopyFlag = () => {
        updateNoteFlag(currentNote.id, "oneClickCopy");
    };

    const handleToggleSelectNote = () => {
        const noteId = currentNote.id;
        if (isSelectedNote(noteId)) {
            removeSelectedNote(noteId);
        } else {
            addSelectedNote(noteId);
        }
    };

    return (
        <div className="p-1 flex flex-col gap-y-1">
            <DropdownMenuItem onClick={(e) => handleButtonClick(e, "copy-normal")}>Copy</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleButtonClick(e, "copy-formatted")}>Copy Formatted</DropdownMenuItem>
            {!isLargeScreen && (
                <DropdownMenuItem onClick={(e) => handleButtonClick(e, "edit")}>Edit Note</DropdownMenuItem>
            )}
            <DropdownMenuItem>
                <div className="flex items-center justify-between w-full gap-x-2">
                    <span className="text-sm">{isSelectedNote(currentNote.id) ? "Deselect Note" : "Select Note"}</span>
                    <Switch checked={isSelectedNote(currentNote.id)} onCheckedChange={handleToggleSelectNote} />
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <div className="flex items-center justify-between w-full gap-x-2">
                    <span className="text-sm">One-Click Copy</span>
                    <Switch checked={currentNote.oneClickCopy} onCheckedChange={handleToggleCopyFlag} />
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={(e) => handleButtonClick(e, "delete")}>
                Delete Note
            </DropdownMenuItem>
        </div>
    );
}
