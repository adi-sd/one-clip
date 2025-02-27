"use client";

import { useEffect, useState, useMemo } from "react";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NotesContainer from "@/components/notes-container/NotesContainer";
import DisplayContainer from "@/components/display-container/DisplayContainer";
import ActionContainer from "@/components/action-container/ActionContainer";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import { useScreenResize } from "@/hooks/useScreenResize";
import { useNotesStore } from "@/store/noteStore";
import { ListType, Note } from "@/types/note";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const {
        user,
        notes,
        currentNote,
        isLoading,
        setCurrentNote,
        fetchNotes,
        updateNote,
        updateNoteFlag,
        deleteNote,
        setUser,
    } = useNotesStore();

    const { isLargeScreen, isDialogAllowed } = useScreenResize();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // Set the user in the store and fetch notes if a user is available.
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Cast user id as string (if necessary)
            setUser({ id: String(session.user.id), name: session.user.name! });
            fetchNotes();
        } else {
            setUser(null);
        }
    }, [session, status, setUser, fetchNotes]);

    useEffect(() => {
        if (isDialogAllowed) {
            setIsDialogOpen(true);
        } else {
            setIsDialogOpen(false);
        }
    }, [isDialogAllowed]);

    // Compute filtered notes based on the search query.
    const filteredNotes = useMemo(() => {
        if (!searchQuery) return notes;
        return notes.filter(
            (note) =>
                note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [notes, searchQuery]);

    // Handler: select a note by id.
    const handleSelectNote = (id: string) => {
        const selected = notes.find((note) => note.id === id) || null;
        setCurrentNote(selected);
    };

    // Handler: create a new empty note.
    const handleCreateNewEmptyNote = () => {
        if (!user) {
            return;
        }
        const newNote = {
            title: "New Note",
            content: "",
            listType: "default" as ListType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id, // Include the user id
            disableOneClickCopy: false, // Default value
        };
        // Update the store: add new note at the beginning and set it as the current note.
        useNotesStore.setState(() => ({
            // notes: [newNote, ...state.notes],
            currentNote: newNote as Note,
        }));
    };

    // Handler: update the search query.
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <DashboardMessage>
                <span>No notes available for the account!</span>
            </DashboardMessage>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-2 md:gap-6 overflow-hidden">
            <div className="w-full h-full gap-x-4 flex items-center justify-center overflow-hidden">
                {/* Notes List */}
                <div
                    className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full flex flex-col gap-y-2 md:gap-y-4`}
                >
                    <ActionContainer
                        isLargeScreen={isLargeScreen}
                        onCreateNote={handleCreateNewEmptyNote}
                        onSearch={handleSearch}
                    />
                    {filteredNotes.length === 0 ? (
                        <DashboardMessage>
                            <span>No matches for the search!</span>
                        </DashboardMessage>
                    ) : (
                        <NotesContainer
                            notes={filteredNotes}
                            selectNote={handleSelectNote}
                            handleUpdateNoteFlag={updateNoteFlag} // Make sure NotesContainer accepts this prop
                            onDelete={deleteNote}
                            showEditButton={isLargeScreen}
                            showOptionButton={isLargeScreen}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    )}
                </div>

                {/* Display Container for large screens */}
                {!isDialogAllowed && currentNote && (
                    <div className="w-2/6 h-full pb-1">
                        <DisplayContainer
                            currentNote={currentNote}
                            onEdit={updateNote}
                            onDelete={deleteNote}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    </div>
                )}

                {/* Mobile Edit Dialog */}
                {isDialogAllowed && currentNote && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent
                            className="h-[90%] w-[90%] p-0 bg-white [&>button]:hidden rounded-md overflow-hidden"
                            aria-describedby={undefined}
                        >
                            <DialogTitle className="hidden">{currentNote?.title}</DialogTitle>
                            <div className="w-full h-full overflow-hidden">
                                <DisplayContainer
                                    currentNote={currentNote}
                                    onEdit={updateNote}
                                    onDelete={deleteNote}
                                    setIsDialogOpen={setIsDialogOpen}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
