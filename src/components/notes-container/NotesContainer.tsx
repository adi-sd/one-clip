import NoteCard from "@/components/notes-container/NoteCard";
import { Note } from "@/types/note";

const NotesContainer = ({
    filteredNotes,
    setIsDialogOpen,
}: {
    filteredNotes: Note[];
    setIsDialogOpen: (value: boolean) => void;
}) => {
    return (
        <div className="w-full p-0 md:p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 overflow-y-scroll scrollbar-hide">
            {filteredNotes.map((note: Note) => (
                <NoteCard key={note.id} note={note} setIsDialogOpen={setIsDialogOpen} />
            ))}
        </div>
    );
};

export default NotesContainer;
