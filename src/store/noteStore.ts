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
    // Master notes stored as a Map for O(1) lookups.
    notes: Map<string, Note>;
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
    // Filtered notes and search query
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredNotes: Note[];
    setFilteredNotes: (query: string) => void;
    sortFilteredNotes: (sortKey: SortByKeys) => void;
    // Selected notes functionality
    selectedNotes: Set<string>;
    addSelectedNote: (noteId: string) => void;
    removeSelectedNote: (noteId: string) => void;
    isSelectedNote: (noteId: string) => boolean;
    deleteSelected: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => {
    // Helper: Save an updated note in the store.
    const saveUpdatedNote = async (noteToUpdate: Note): Promise<Note> => {
        const { notes, currentNote } = get();
        const savedNote = await noteService.updateNote(noteToUpdate);
        const newNotes = new Map(notes);
        newNotes.set(savedNote.id, savedNote);
        set({
            notes: newNotes,
            currentNote: currentNote && currentNote.id === savedNote.id ? savedNote : currentNote,
        });
        return savedNote;
    };

    // Recalculate filteredNotes based on the current notes Map and search query.
    const recalculateFilteredNotes = () => {
        const { notes, searchQuery } = get();
        const allNotes = Array.from(notes.values());
        let newFiltered: Note[];
        if (!searchQuery || !searchQuery.trim()) {
            newFiltered = allNotes;
        } else {
            newFiltered = allNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        set({
            filteredNotes: newFiltered,
            currentNote: newFiltered.length > 0 ? newFiltered[0] : null,
        });
    };

    return {
        user: null,
        setUser: (user) => set({ user }),
        notes: new Map<string, Note>(),
        currentNote: null,
        isLoading: false,
        isDialogOpen: false,
        setNotes: (notesArr: Note[]) => {
            const notesMap = new Map(notesArr.map((note) => [note.id, note]));
            set({ notes: notesMap });
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
                // Use setNotes to update the Map and recalculate filteredNotes.
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
                const newNotes = new Map(notes);
                newNotes.set(newNote.id, newNote);
                set({
                    notes: newNotes,
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
            if (!updatedNote.id) {
                await get().createNewNote(updatedNote);
                return;
            }
            if (!notes.has(updatedNote.id)) {
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
            const noteToUpdate = notes.get(noteId);
            if (!noteToUpdate) {
                throw new Error("Cannot update note flag: note not found in store.");
            }
            try {
                const toggledValue = !(noteToUpdate[flagName] as boolean);
                const savedNote = await noteService.updateNoteFlag(noteId, flagName, toggledValue);
                const newNotes = new Map(notes);
                newNotes.set(savedNote.id, savedNote);
                set({
                    notes: newNotes,
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
            if (!currentNote.id) {
                const newNotes = new Map(notes);
                newNotes.delete(currentNote.id);
                set({
                    notes: newNotes,
                    currentNote: null,
                });
                toast.error("Note deleted!");
                recalculateFilteredNotes();
                return;
            }
            if (currentNote.id !== noteId) {
                throw new Error("Cannot delete note: current note does not match the provided note id.");
            }
            try {
                await noteService.deleteNote(noteId);
                const newNotes = new Map(notes);
                newNotes.delete(noteId);
                set({
                    notes: newNotes,
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
        // Filtered Notes and Search
        searchQuery: "",
        setSearchQuery: (query: string) => {
            set({ searchQuery: query });
            recalculateFilteredNotes();
        },
        filteredNotes: [],
        setFilteredNotes: (query: string) => {
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
            set({ filteredNotes: sorted, currentNote: sorted.length > 0 ? sorted[0] : null });
        },
        // Selected Notes
        selectedNotes: new Set<string>(),
        addSelectedNote: (noteId: string) => {
            const selectedNotes = get().selectedNotes;
            if (!selectedNotes.has(noteId)) {
                selectedNotes.add(noteId);
                set({ selectedNotes: new Set(selectedNotes) });
            }
        },
        removeSelectedNote: (noteId: string) => {
            const selectedNotes = get().selectedNotes;
            if (selectedNotes.has(noteId)) {
                selectedNotes.delete(noteId);
                set({ selectedNotes: new Set(selectedNotes) });
            }
        },
        isSelectedNote: (noteId: string) => {
            return get().selectedNotes.has(noteId);
        },
        deleteSelected: async () => {
            const { selectedNotes, notes, currentNote } = get();
            if (selectedNotes.size === 0) {
                toast.error("No selected notes to delete.");
                return;
            }
            try {
                await Promise.all(Array.from(selectedNotes).map((noteId) => noteService.deleteNote(noteId)));
                const newNotes = new Map(notes);
                for (const noteId of selectedNotes) {
                    newNotes.delete(noteId);
                }
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
