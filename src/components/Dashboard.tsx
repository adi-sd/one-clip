"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sampleNotes from "@/data/sampleNotes";
import NotesContainer from "@/components/NotesContainer";
import DisplayContainer from "@/components/DisplayContainer";
import { Note } from "@/types/note";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";


const Dashboard = () => {
    const { status } = useSession();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            setNotes(sampleNotes);
            setSelectedNote(sampleNotes.length > 0 ? sampleNotes[0] : null);
        }

        // Check screen size and update state
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024; // lg breakpoint
            setIsLargeScreen(isLarge);
            if (isLarge) setIsDialogOpen(false); // Close dialog if switching to large screen
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [status, router]);

    const handleSelectNote = (id: string) => {
        setSelectedNote(notes.find((note) => note.id === id) || null);
        if (!isLargeScreen) {
            setIsDialogOpen(true); // Open dialog on mobile
        }
    };

    const handleDeleteNote = (id: string) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
    };

    const handleSaveNote = (updatedNote: Note) => {
        const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note));
        setNotes(updatedNotes);
        setSelectedNote(updatedNote);
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6">
            {/* Notes List - Always visible */}
            <div className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full`}>
                <NotesContainer
                    notes={notes}
                    onEdit={handleSelectNote}
                    onDelete={handleDeleteNote}
                    showEditButton={!isLargeScreen} // ✅ Show edit button only when DisplayContainer is hidden
                />
            </div>

            {/* Display Container - Only visible on lg/xl */}
            {isLargeScreen && (
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
