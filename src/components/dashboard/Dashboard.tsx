"use client";

import { ClipLoader } from "react-spinners";
import NotesContainer from "@/components/notes-container/NotesContainer";
import DisplayContainer from "@/components/display-container/DisplayContainer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ActionContainer from "@/components/action-container/ActionContainer";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardMessage from "@/components/dashboard/DashboardMessage";

const Dashboard = () => {
    const {
        notes,
        filteredNotes,
        currentNote,
        isLargeScreen,
        isDialogOpen,
        isLoading,
        showSignInMessage,
        setIsDialogOpen,
        handleSelectNote,
        handleCreateNewEmptyNote,
        handleUpdateNote,
        handleDeleteNote,
        handleSearch,
    } = useDashboard();

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-2 md:gap-6 overflow-hidden">
            {/* Show sign-in message if user closes auth modal */}
            {showSignInMessage && (
                <DashboardMessage>
                    <span> Please sign in to view your notes!</span>
                </DashboardMessage>
            )}

            {!showSignInMessage && (
                <div className="w-full h-full gap-x-4 flex items-center justify-center overflow-hidden">
                    {/* Notes List - Always visible */}
                    <div
                        className={`w-full ${isLargeScreen ? "lg:w-4/6" : "w-full"} h-full flex flex-col gap-y-2 md:gap-y-4`}
                    >
                        <ActionContainer
                            isLargeScreen={isLargeScreen}
                            onCreateNote={handleCreateNewEmptyNote}
                            onSearch={handleSearch}
                        />
                        {isLoading ? (
                            <DashboardMessage>
                                <ClipLoader size={40} className="text-green-500 font-bold" />
                            </DashboardMessage>
                        ) : notes.length === 0 ? (
                            <DashboardMessage>
                                <span>No notes available for the account!</span>
                            </DashboardMessage>
                        ) : filteredNotes.length === 0 ? (
                            <DashboardMessage>
                                <span>No matches for the search!</span>
                            </DashboardMessage>
                        ) : (
                            <NotesContainer
                                notes={filteredNotes}
                                selectNote={handleSelectNote}
                                onEdit={handleUpdateNote}
                                onDelete={handleDeleteNote}
                                showEditButton={isLargeScreen}
                                showOptionButton={isLargeScreen}
                            />
                        )}
                    </div>

                    {/* Display Container - Only visible on lg/xl */}
                    {isLargeScreen && currentNote && (
                        <div className="w-2/6 h-full pb-1">
                            <DisplayContainer
                                currentNote={currentNote}
                                onEdit={handleUpdateNote}
                                onDelete={handleDeleteNote}
                            />
                        </div>
                    )}

                    {/* Mobile Edit Dialog */}
                    {!isLargeScreen && currentNote && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent
                                className="h-[90%] w-[90%] p-0 bg-white [&>button]:hidden rounded-md overflow-hidden"
                                aria-describedby={undefined}
                            >
                                <DialogTitle className="hidden">{currentNote?.title}</DialogTitle>
                                <div className="w-full h-full overflow-hidden">
                                    <DisplayContainer
                                        currentNote={currentNote}
                                        onEdit={handleUpdateNote}
                                        onDelete={handleDeleteNote}
                                        setIsDialogOpen={setIsDialogOpen}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
