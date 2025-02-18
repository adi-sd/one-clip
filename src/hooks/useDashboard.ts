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
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            setSelectedNote(data.length > 0 ? data[0] : null);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            handleOpenAuthModal(); // ✅ Open Auth Modal when not signed in
            setShowSignInMessage(true); // ✅ Show sign-in message
        } else if (status === "authenticated" && session) {
            setShowSignInMessage(false); // ✅ Hide sign-in message
            fetchNotes();
        }

        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024; // lg breakpoint
            setIsLargeScreen(isLarge);
            if (isLarge) setIsDialogOpen(false);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [status, session, router]);

    const handleSelectNote = (id: string) => {
        setSelectedNote(notes.find((note) => note.id === id) || null);
        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    const handleCreateNote = async () => {
        const newNote = {
            id: crypto.randomUUID(),
            name: "Untitled Note",
            content: "",
            listType: "default",
        };

        setUnsavedNote(newNote as Note);
        setSelectedNote(newNote as Note);

        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    const handleSaveNote = async (updatedNote: Note) => {
        try {
            const isNewNote = unsavedNote?.id === updatedNote.id;

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

            setNotes((prevNotes) =>
                isNewNote
                    ? [savedNote, ...prevNotes]
                    : prevNotes.map((note) => (note.id === savedNote.id ? savedNote : note))
            );

            setSelectedNote(savedNote);
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
                setSelectedNote(notes.length > 0 ? notes[0] : null);
                return;
            }

            const response = await fetch("/api/notes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Failed to delete note");

            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            setSelectedNote(notes.length > 1 ? notes[1] : null);

            toast.error("Note deleted!");
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return {
        notes,
        selectedNote,
        isLargeScreen,
        isDialogOpen,
        isLoading,
        showSignInMessage,
        setSelectedNote,
        setIsDialogOpen,
        handleSelectNote,
        handleCreateNote,
        handleSaveNote,
        handleDeleteNote,
    };
};
