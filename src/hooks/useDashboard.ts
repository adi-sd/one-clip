import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/providers/AuthModalProvider";
import { Note } from "@/types/note";
import { toast } from "sonner";

export const useDashboard = () => {
    const { status, data: session } = useSession();
    const router = useRouter();
    const { openAuthModal } = useAuthModal(); // ✅ Controls auth modal
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]); // ✅ Filtered notes state
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [unsavedNote, setUnsavedNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true); // ✅ Loading state
    const [showSignInMessage, setShowSignInMessage] = useState(false); // ✅ Controls sign-in prompt

    const handleOpenAuthModal = useCallback(() => {
        openAuthModal();
    }, [openAuthModal]);

    // ✅ Fetch notes only after user is authenticated
    const fetchNotes = async () => {
        try {
            setIsLoading(true); // Start loading
            const response = await fetch("/api/notes");
            const data = await response.json();
            setNotes(data);
            setFilteredNotes(data); // ✅ Initialize filtered notes
            setCurrentNote(data.length > 0 ? data[0] : null);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024; // lg breakpoint
            setIsLargeScreen(isLarge);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            handleOpenAuthModal(); // ✅ Open Auth Modal when not signed in
            setIsLoading(false);
            setShowSignInMessage(true); // ✅ Show sign-in message
        } else if (status === "authenticated" && session) {
            setShowSignInMessage(false); // ✅ Hide sign-in message
            fetchNotes();
        }
        if (isLargeScreen) {
            setIsDialogOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session, router]);

    useEffect(() => {
        setFilteredNotes(notes); // ✅ Keep filteredNotes in sync when notes change
    }, [notes]);

    // ✅ Handle search filtering
    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredNotes(notes); // ✅ If query is empty, show all notes
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = notes.filter(
            (note) => note.name.toLowerCase().includes(lowerQuery) || note.content.toLowerCase().includes(lowerQuery)
        );
        setFilteredNotes(filtered);
    };

    const handleSelectNote = (id: string) => {
        setCurrentNote(notes.find((note) => note.id === id) || null);
        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    const handleCreateNewEmptyNote = async () => {
        const newNote = {
            id: crypto.randomUUID(),
            name: "New Note",
            content: "",
            listType: "default",
            createdAt: new Date().toISOString(),
        } as Note;

        setUnsavedNote(newNote as Note);
        setCurrentNote(newNote as Note);

        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    const handleUpdateNote = async (updatedNote: Note) => {
        try {
            const isNewNote = unsavedNote?.id === updatedNote.id;

            // ✅ Prevent creating a new note if it's empty
            if (isNewNote && !updatedNote.name.trim()) {
                toast.info("Cannot create a note with empty name!");
                return;
            }

            // ✅ Find the existing note (if any)
            const existingNote = notes.find((note) => note.id === updatedNote.id);

            // ✅ Prevent update if content & title haven't changed
            if (
                !isNewNote &&
                existingNote &&
                existingNote.name.trim() === updatedNote.name.trim() &&
                existingNote.content === updatedNote.content
            ) {
                toast.info("No changes detected.");
                return;
            }

            const response = await fetch(isNewNote ? "/api/notes" : `/api/notes/${updatedNote.id}`, {
                method: isNewNote ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: updatedNote.name.trim(),
                    content: updatedNote.content ?? "",
                    listType: updatedNote.listType ?? "default",
                }),
            });

            if (!response.ok) throw new Error("Failed to save note");

            const savedNote = await response.json();

            setNotes(
                (prevNotes) =>
                    isNewNote
                        ? [savedNote, ...prevNotes] // ✅ Add new note at the start
                        : prevNotes.map((note) => (note.id === savedNote.id ? savedNote : note)) // ✅ Replace existing note
            );

            setCurrentNote(savedNote);
            setUnsavedNote(null);

            toast.success(isNewNote ? "New Note Created!" : "Note Updated!");
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note.");
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            const isUnsaved = unsavedNote?.id === id;

            if (isUnsaved) {
                setUnsavedNote(null);
                setCurrentNote(notes.length > 0 ? notes[0] : null);
                return;
            }

            const response = await fetch(`/api/notes/${id}`, {
                // ✅ Correct API endpoint
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to delete note");

            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

            // ✅ Ensure selected note updates correctly after deletion
            setCurrentNote((prevSelected) =>
                prevSelected?.id === id ? (notes.length > 1 ? notes[1] : null) : prevSelected
            );

            toast.error("Note deleted!");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note.");
        }
    };

    return {
        notes,
        filteredNotes,
        currentNote,
        isLargeScreen,
        isDialogOpen,
        isLoading,
        showSignInMessage,
        setCurrentNote,
        setIsDialogOpen,
        handleSelectNote,
        handleCreateNewEmptyNote,
        handleUpdateNote,
        handleDeleteNote,
        handleSearch,
    };
};
