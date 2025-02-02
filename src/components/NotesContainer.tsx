"use client";

import { Note } from "@/types/note";
import NotesCard from "@/components/NoteCard";

const NotesContainer = ({
    notes,
    onEdit,
    onDelete,
}: {
    notes: Note[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notes.length === 0 ? (
                <p>No notes available. Start by adding a new note!</p>
            ) : (
                notes.map((note) => (
                    <NotesCard
                        key={note.id}
                        note={note}
                        onEdit={() => onEdit(note.id)}
                        onDelete={() => onDelete(note.id)}
                    />
                ))
            )}
        </div>
    );
};

export default NotesContainer;
