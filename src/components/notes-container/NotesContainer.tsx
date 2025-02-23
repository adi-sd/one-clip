import { Note } from "@/types/note";
import NoteCard from "@/components/notes-container/NoteCard";

const NotesContainer = ({
    notes,
    selectNote,
    onDelete,
    showEditButton,
    showOptionButton,
}: {
    notes: Note[];
    selectNote: (id: string) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
    showOptionButton: boolean;
}) => {
    return (
        <div className="w-full p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 overflow-y-scroll scrollbar-hide">
            {notes.length === 0 ? (
                <p>No notes available. Start by adding a new note!</p>
            ) : (
                notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        selectNote={() => selectNote(note.id)}
                        onDelete={() => onDelete(note.id)}
                        showEditButton={showEditButton}
                        showOptionButton={showOptionButton}
                    />
                ))
            )}
        </div>
    );
};

export default NotesContainer;
