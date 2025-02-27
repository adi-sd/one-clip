"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NotesContainer from "@/components/notes-container/NotesContainer";
import DisplayContainer from "@/components/display-container/DisplayContainer";
import ActionContainer from "@/components/action-container/ActionContainer";
import DashboardMessage from "@/components/dashboard/DashboardMessage";
import { useScreenResize } from "@/hooks/useScreenResize";
import { useNotesStore } from "@/store/noteStore";
import { Note } from "@/types/note";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const { user, notes, currentNote, isLoading, fetchNotes, setUser } = useNotesStore();

    const { isLargeScreen, isDialogAllowed } = useScreenResize();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // Set the user in the store and fetch notes if available.
    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setUser({ id: String(session.user.id), name: session.user.name! });
            fetchNotes();
        } else {
            setUser(null);
        }
    }, [session, status, setUser, fetchNotes]);

    // When the full notes array changes, update the filteredNotes if no search is active.
    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    if (!user) {
        return (
            <DashboardMessage>
                <span>Please log in with Google to start!</span>
            </DashboardMessage>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-2 md:gap-6 overflow-hidden">
            <div className="w-full h-full gap-x-4 flex items-center justify-center overflow-hidden">
                {/* Left side: Notes List */}
                <div
                    className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full flex flex-col gap-y-2 md:gap-y-4`}
                >
                    {/* Pass filteredNotes setter to ActionContainer so it can update the state */}
                    <ActionContainer setFilteredNotes={setFilteredNotes} />
                    {notes.length === 0 ? (
                        <DashboardMessage>
                            <span>No notes available for the account!</span>
                        </DashboardMessage>
                    ) : filteredNotes.length === 0 ? (
                        <DashboardMessage>
                            <span>No matches for the search!</span>
                        </DashboardMessage>
                    ) : (
                        <NotesContainer filteredNotes={filteredNotes} setIsDialogOpen={setIsDialogOpen} />
                    )}
                </div>

                {/* Right side: Display Container for large screens */}
                {!isDialogAllowed && currentNote && (
                    <div className="w-2/6 h-full pb-1">
                        <DisplayContainer setIsDialogOpen={setIsDialogOpen} />
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
                                <DisplayContainer setIsDialogOpen={setIsDialogOpen} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
