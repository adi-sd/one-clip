// noteService.ts
import { Note, ToggleFlag } from "@/types/note";

export const fetchNotes = async (userId: string): Promise<Note[]> => {
    const res = await fetch(`/api/notes?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch notes");
    return await res.json();
};

export const createNote = async (note: Partial<Note>, userId: string): Promise<Note> => {
    const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, userId }),
    });
    if (!res.ok) throw new Error("Failed to create note");
    return await res.json();
};

export const updateNote = async (updatedNote: Note): Promise<Note> => {
    const res = await fetch(`/api/notes/${updatedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
    });
    if (!res.ok) throw new Error("Failed to update note");
    return await res.json();
};

export const updateNoteFlag = async (noteId: string, flagName: ToggleFlag, newValue: boolean): Promise<Note> => {
    const res = await fetch(`/api/notes/${noteId}/${flagName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
    });
    if (!res.ok) {
        throw new Error("Failed to update note flag");
    }
    return await res.json();
};

export const deleteNote = async (noteId: string): Promise<void> => {
    const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete note");
};
