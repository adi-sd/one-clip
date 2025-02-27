// store/noteStore.ts
import { create } from "zustand";
import { Note, ToggleFlag } from "@/types/note";
import * as noteService from "@/services/noteService";
import { toast } from "sonner";

interface User {
    id: string;
    name?: string;
}

interface NotesState {
    user: User | null;
    setUser: (user: User | null) => void;
    notes: Note[];
    currentNote: Note | null;
    isLoading: boolean;
    isDialogOpen: boolean;
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (note: Note | null) => void;
    setIsDialogOpen: (open: boolean) => void;
    fetchNotes: () => Promise<void>;
    createNewNote: (note: Note) => Promise<Note>;
    updateNote: (updatedNote: Note) => Promise<void>;
    updateNoteFlag: (noteId: string, flagName: ToggleFlag) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => {
    // Internal helper: Save an updated note in the store.
    const saveUpdatedNote = async (noteToUpdate: Note): Promise<Note> => {
        const { notes, currentNote } = get();
        const savedNote = await noteService.updateNote(noteToUpdate);
        set({
            notes: notes.map((n) => (n.id === savedNote.id ? savedNote : n)),
            currentNote: currentNote && currentNote.id === savedNote.id ? savedNote : currentNote,
        });
        return savedNote;
    };

    return {
        user: null,
        setUser: (user) => set({ user }),
        notes: [],
        currentNote: null,
        isLoading: false,
        isDialogOpen: false,
        setNotes: (notes) => set({ notes }),
        setCurrentNote: (note) => set({ currentNote: note }),
        setIsDialogOpen: (open: boolean) => set({ isDialogOpen: open }),
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
        createNewNote: async (note: Note): Promise<Note> => {
            const { user, notes } = get();
            try {
                const newNote = await noteService.createNote(note, user ? user.id : "");
                set({
                    notes: [newNote, ...notes],
                    currentNote: newNote,
                });
                toast.success("New Note Created!");
                return newNote;
            } catch (error) {
                console.error("Error creating note:", error);
                toast.error("Failed to create note.");
                throw error;
            }
        },
        updateNote: async (updatedNote: Note) => {
            const { notes } = get();

            // New note: if updatedNote.id is falsy.
            if (!updatedNote.id) {
                await get().createNewNote(updatedNote);
                return;
            }

            // Ensure the note exists in the store.
            const noteExists = notes.some((note) => note.id === updatedNote.id);
            if (!noteExists) {
                throw new Error("Cannot update note: note not found in store.");
            }

            try {
                await saveUpdatedNote(updatedNote);
                toast.success("Note Updated!");
            } catch (error) {
                console.error("Error updating note:", error);
                toast.error("Failed to update note.");
                throw error;
            }
        },
        updateNoteFlag: async (noteId: string, flagName: ToggleFlag) => {
            const { notes } = get();
            const noteToUpdate = notes.find((n) => n.id === noteId);
            if (!noteToUpdate) {
                throw new Error("Cannot update note flag: note not found in store.");
            }
            try {
                const toggledValue = !(noteToUpdate[flagName] as boolean);
                const updatedNote = { ...noteToUpdate, [flagName]: toggledValue };
                await saveUpdatedNote(updatedNote);
                toast.success(`${flagName} ${toggledValue ? "Enabled" : "Disabled"}!`);
            } catch (error) {
                console.error("Error updating note flag:", error);
                toast.error("Failed to update note flag.");
                throw error;
            }
        },
        deleteNote: async (noteId: string) => {
            const { currentNote, notes } = get();
            if (!currentNote) {
                throw new Error("No current note set.");
            }
            // If the current note has no id, it's unsaved—delete it locally.
            if (!currentNote.id) {
                set({
                    notes: notes.filter((note) => note !== currentNote),
                    currentNote: null,
                });
                toast.error("Note deleted!");
                return;
            }
            if (currentNote.id !== noteId) {
                throw new Error("Cannot delete note: current note does not match the provided note id.");
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
    };
});
