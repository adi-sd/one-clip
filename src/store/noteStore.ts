// store/noteStore.ts
import { create } from "zustand";
import { Note, ToggleFlag } from "@/types/note";
import { SortByKeys, SortByTypesArray } from "@/types/sort";
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
    // Filtered Note
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredNotes: Note[];
    setFilteredNotes: (query: string) => void;
    sortFilteredNotes: (sortKey: SortByKeys) => void;
    // Select Note
    selectedNotes: Set<string>; // changed from string[]
    addSelectedNote: (noteId: string) => void;
    removeSelectedNote: (noteId: string) => void;
    isSelectedNote: (noteId: string) => boolean;
    deleteSelected: () => Promise<void>;
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

    // Recalculate filteredNotes based on the current notes and search query.
    const recalculateFilteredNotes = () => {
        const { notes, searchQuery } = get();
        let newFiltered: Note[];
        if (!searchQuery || !searchQuery.trim()) {
            newFiltered = notes;
        } else {
            newFiltered = notes.filter(
                (note) =>
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        set({
            filteredNotes: newFiltered,
            // currentNote: newFiltered.length > 0 ? newFiltered[0] : null,
        });
    };

    return {
        user: null,
        setUser: (user) => set({ user }),
        notes: [],
        currentNote: null,
        isLoading: false,
        isDialogOpen: false,
        setNotes: (notes) => {
            set({ notes });
            recalculateFilteredNotes();
        },
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
                // Use the setNotes method so that filteredNotes are recalculated.
                get().setNotes(data);
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
                recalculateFilteredNotes();
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
                recalculateFilteredNotes();
                toast.success("Note Updated!");
            } catch (error) {
                console.error("Error updating note:", error);
                toast.error("Failed to update note.");
                throw error;
            }
        },
        updateNoteFlag: async (noteId: string, flagName: ToggleFlag) => {
            const { notes, currentNote } = get();
            const noteToUpdate = notes.find((n) => n.id === noteId);
            if (!noteToUpdate) {
                throw new Error("Cannot update note flag: note not found in store.");
            }
            try {
                // Toggle the flag value.
                const toggledValue = !(noteToUpdate[flagName] as boolean);
                // Call the service function with the nested endpoint.
                const savedNote = await noteService.updateNoteFlag(noteId, flagName, toggledValue);
                set({
                    notes: notes.map((n) => (n.id === savedNote.id ? savedNote : n)),
                    currentNote: currentNote && currentNote.id === savedNote.id ? savedNote : currentNote,
                });
                recalculateFilteredNotes();
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
                recalculateFilteredNotes();
                toast.error("Note deleted!");
            } catch (error) {
                console.error("Error deleting note:", error);
                toast.error("Failed to delete note.");
                throw error;
            }
        },
        // Filtered Notes
        searchQuery: "",
        setSearchQuery: (query: string) => {
            set({ searchQuery: query });
            recalculateFilteredNotes();
        },
        filteredNotes: [],
        setFilteredNotes: (query: string) => {
            // Update the searchQuery and recalculate filteredNotes.
            set({ searchQuery: query });
            recalculateFilteredNotes();
        },
        sortFilteredNotes: (sortKey: SortByKeys) => {
            const { filteredNotes } = get();
            const sortOption = SortByTypesArray.find((opt) => opt.key === sortKey);
            if (!sortOption) {
                toast.error("Invalid sort key.");
                return;
            }
            const sorted = [...filteredNotes].sort(sortOption.compareFunction);
            set({ filteredNotes: sorted });
        },
        // Selected Notes
        selectedNotes: new Set<string>(),
        // Add a note id to the selectedNotes if it isn't already selected.
        addSelectedNote: (noteId: string) => {
            const selectedNotes = get().selectedNotes;
            if (!selectedNotes.has(noteId)) {
                selectedNotes.add(noteId);
                // Trigger a state update by setting a new Set.
                set({ selectedNotes: new Set(selectedNotes) });
            }
        },
        // Remove the note id from the selectedNotes
        removeSelectedNote: (noteId: string) => {
            const selectedNotes = get().selectedNotes;
            if (selectedNotes.has(noteId)) {
                selectedNotes.delete(noteId);
                set({ selectedNotes: new Set(selectedNotes) });
            }
        },
        // Check whether a note id exists in the selectedNotes
        isSelectedNote: (noteId: string) => {
            return get().selectedNotes.has(noteId);
        },
        // Delete Selected Notes
        deleteSelected: async () => {
            const { selectedNotes, notes, currentNote } = get();
            if (selectedNotes.size === 0) {
                toast.error("No selected notes to delete.");
                return;
            }
            try {
                // Delete all selected notes concurrently.
                await Promise.all(Array.from(selectedNotes).map((noteId) => noteService.deleteNote(noteId)));
                // Update the notes array by filtering out deleted notes.
                const newNotes = notes.filter((note) => !selectedNotes.has(note.id));
                // If the current note was among the selected ones, clear it.
                set({
                    notes: newNotes,
                    currentNote: currentNote && selectedNotes.has(currentNote.id) ? null : currentNote,
                    selectedNotes: new Set(),
                });
                recalculateFilteredNotes();
                toast.success("Selected notes deleted!");
            } catch (error) {
                console.error("Error deleting selected notes:", error);
                toast.error("Failed to delete selected notes.");
                throw error;
            }
        },
    };
});
