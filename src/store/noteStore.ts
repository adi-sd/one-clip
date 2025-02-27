// store/notesStore.ts
import { create } from "zustand";
import { Note } from "@/types/note";
import * as noteService from "@/services/noteService";
import { toast } from "sonner";

interface User {
    id: string;
    name?: string;
    // add additional properties if needed
}

interface NotesState {
    user: User | null;
    setUser: (user: User | null) => void;
    notes: Note[];
    currentNote: Note | null;
    isLoading: boolean;
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (note: Note | null) => void;
    fetchNotes: () => Promise<void>;
    updateNote: (updatedNote: Note) => Promise<void>;
    updateNoteFlag: (noteId: string, flagName: "disableOneClickCopy", newFlagValue: boolean) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    notes: [],
    currentNote: null,
    isLoading: false,
    setNotes: (notes) => set({ notes }),
    setCurrentNote: (note) => set({ currentNote: note }),
    fetchNotes: async () => {
        const { user } = get();
        if (!user || !user.id) {
            toast.error("User not found. Cannot fetch notes.");
            return;
        }
        set({ isLoading: true });
        try {
            const data = await noteService.fetchNotes(user.id);
            set({ notes: data });
            if (data.length > 0) {
                set({ currentNote: data[0] });
            }
        } catch (error) {
            toast.error("Failed to load notes. Please try again.");
            console.error("Fetch notes error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateNote: async (updatedNote: Note) => {
        const { currentNote, notes, user } = get();

        // New note: if updatedNote.id is falsy (empty string, undefined, or null)
        if (!updatedNote.id) {
            try {
                // Call createNote API; pass the note and user id.
                const newNote = await noteService.createNote(updatedNote, user ? user.id : "");
                set({
                    notes: [newNote, ...notes],
                    currentNote: newNote,
                });
                toast.success("New Note Created!");
            } catch (error) {
                console.error("Error creating note:", error);
                toast.error("Failed to create note.");
                throw error;
            }
            return;
        }

        // Existing note update: ensure current note is set and matches updatedNote
        if (!currentNote || currentNote.id !== updatedNote.id) {
            throw new Error("Cannot update note: current note is not set or does not match.");
        }
        try {
            const savedNote = await noteService.updateNote(updatedNote);
            set({
                notes: notes.map((note) => (note.id === savedNote.id ? savedNote : note)),
                currentNote: savedNote,
            });
            toast.success("Note Updated!");
        } catch (error) {
            console.error("Error updating note:", error);
            toast.error("Failed to update note.");
            throw error;
        }
    },
    updateNoteFlag: async (noteId: string, flagName: "disableOneClickCopy", newFlagValue: boolean) => {
        const { currentNote, notes } = get();
        if (!currentNote || currentNote.id !== noteId) {
            throw new Error("Cannot update note flag: current note is not set or does not match.");
        }
        try {
            const updatedNote = { ...currentNote, [flagName]: newFlagValue };
            const savedNote = await noteService.updateNote(updatedNote);
            set({
                notes: notes.map((note) => (note.id === savedNote.id ? savedNote : note)),
                currentNote: savedNote,
            });
            toast.success(`Note Updated! ${newFlagValue ? "One-Click Copy Disabled" : "One-Click Copy Enabled"}`);
        } catch (error) {
            console.error("Error updating note flag:", error);
            toast.error("Failed to update note flag.");
            throw error;
        }
    },
    deleteNote: async (noteId: string) => {
        const { currentNote, notes } = get();
        if (!currentNote || currentNote.id !== noteId) {
            throw new Error("Cannot delete note: current note is not set or does not match.");
        }
        try {
            await noteService.deleteNote(noteId);
            set({
                notes: notes.filter((note) => note.id !== noteId),
                currentNote: null,
            });
            toast.error("Note deleted!");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note.");
            throw error;
        }
    },
}));
