import { Note } from "@/types/note";
import NoteCard from "@/components/NoteCard";

const NotesContainer = ({
    notes,
    onEdit,
    onDelete,
    showEditButton, // ✅ Accepts prop to control edit button visibility
}: {
    notes: Note[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notes.length === 0 ? (
                <p>No notes available. Start by adding a new note!</p>
            ) : (
                notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={() => onEdit(note.id)}
                        onDelete={() => onDelete(note.id)}
                        showEditButton={showEditButton} // ✅ Pass the flag to `NoteCard`
                    />
                ))
            )}
        </div>
    );
};

export default NotesContainer;
