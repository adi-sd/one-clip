"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NotesContainer from "@/components/NotesContainer";
import DisplayContainer from "@/components/DisplayContainer";
import { Note } from "@/types/note";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ActionContainer from "./ActionContainer";

const Dashboard = () => {
    const { status } = useSession();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [unsavedNote, setUnsavedNote] = useState<Note | null>(null);

    // Fetch notes from API
    const fetchNotes = async () => {
        try {
            const response = await fetch("/api/notes");
            const data = await response.json();
            setNotes(data);
            setSelectedNote(data.length > 0 ? data[0] : null);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
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
    }, [status, router]);

    const handleSelectNote = (id: string) => {
        setSelectedNote(notes.find((note) => note.id === id) || null);
        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    // ✅ Create new note but don't add it to the list until saved
    const handleCreateNote = async () => {
        const newNote = {
            id: crypto.randomUUID(), // Temporary ID
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

    // ✅ Save a new or existing note to the DB
    const handleSaveNote = async (updatedNote: Note) => {
        try {
            const isNewNote = unsavedNote?.id === updatedNote.id;

            const response = await fetch(isNewNote ? "/api/notes" : `/api/notes/${updatedNote.id}`, {
                // ✅ Now calls `/api/notes/:id`
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
            setUnsavedNote(null); // ✅ Clear unsaved state after saving

            if (isNewNote) {
                toast.success("New Note Created!");
            } else {
                toast.success("Note Updated!");
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    // ✅ Delete note and update display
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

            // ✅ If the deleted note was selected, switch to the first note
            setSelectedNote((prevSelected) =>
                prevSelected?.id === id ? (notes.length > 1 ? notes[1] : null) : prevSelected
            );

            toast.error("Note deleted!");
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6">
            {/* Notes List - Always visible */}
            <div className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full flex flex-col gap-y-4`}>
                <ActionContainer onCreateNote={handleCreateNote} />
                <NotesContainer
                    notes={notes}
                    onEdit={handleSelectNote}
                    onDelete={handleDeleteNote}
                    showEditButton={!isLargeScreen}
                />
            </div>

            {/* Display Container - Only visible on lg/xl */}
            {isLargeScreen && selectedNote && (
                <div className="w-2/6 h-full">
                    <DisplayContainer selectedNote={selectedNote} onEdit={handleSaveNote} onDelete={handleDeleteNote} />
                </div>
            )}

            {/* Mobile Edit Dialog */}
            {!isLargeScreen && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="h-[75vh] w-[80vw] p-0 [&>button]:hidden" aria-describedby={undefined}>
                        <DialogTitle className="hidden">{selectedNote?.name}</DialogTitle>
                        <DisplayContainer
                            selectedNote={selectedNote}
                            onEdit={handleSaveNote}
                            onDelete={handleDeleteNote}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Dashboard;
