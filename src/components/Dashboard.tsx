"use client";

import { ClipLoader } from "react-spinners";
import NotesContainer from "@/components/NotesContainer";
import DisplayContainer from "@/components/DisplayContainer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ActionContainer from "./ActionContainer";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
    const {
        notes,
        filteredNotes,
        selectedNote,
        isLargeScreen,
        isDialogOpen,
        isLoading,
        showSignInMessage,
        setIsDialogOpen,
        handleSelectNote,
        handleCreateNote,
        handleUpdateNote,
        handleDeleteNote,
        handleSearch,
    } = useDashboard();

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6">
            {/* Show sign-in message if user closes auth modal */}
            {showSignInMessage && (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Please sign in to view your notes.
                </div>
            )}

            {!showSignInMessage && (
                <>
                    {/* Notes List - Always visible */}
                    <div className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full flex flex-col gap-y-4`}>
                        <ActionContainer onCreateNote={handleCreateNote} onSearch={handleSearch} />
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <ClipLoader size={40} color="#22c55e" />
                            </div>
                        ) : notes.length === 0 ? (
                            <p className="text-center text-gray-500">No notes available for the account!</p>
                        ) : filteredNotes.length === 0 ? (
                            <p className="text-center text-gray-500">No notes available for the search!</p>
                        ) : (
                            <NotesContainer
                                notes={filteredNotes}
                                onEdit={handleSelectNote}
                                onDelete={handleDeleteNote}
                                showEditButton={!isLargeScreen}
                            />
                        )}
                    </div>

                    {/* Display Container - Only visible on lg/xl */}
                    {isLargeScreen && selectedNote && (
                        <div className="w-2/6 h-full">
                            <DisplayContainer
                                selectedNote={selectedNote}
                                onEdit={handleUpdateNote}
                                onDelete={handleDeleteNote}
                            />
                        </div>
                    )}

                    {/* Mobile Edit Dialog */}
                    {!isLargeScreen && selectedNote && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent
                                className="h-[75vh] w-[80vw] p-0 [&>button]:hidden"
                                aria-describedby={undefined}
                            >
                                <DialogTitle className="hidden">{selectedNote?.name}</DialogTitle>
                                <DisplayContainer
                                    selectedNote={selectedNote}
                                    onEdit={handleUpdateNote}
                                    onDelete={handleDeleteNote}
                                    setIsDialogOpen={setIsDialogOpen}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
