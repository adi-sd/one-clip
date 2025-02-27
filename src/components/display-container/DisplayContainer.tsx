"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import NoteTitleEditor from "@/components/note-editor/NoteTitleEditor";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import NoteContentEditor from "@/components/note-editor/NoteContentEditor";
import { toast } from "sonner";
import { FaX } from "react-icons/fa6";
import { useNotesStore } from "@/store/noteStore";
import { useScreenResize } from "@/hooks/useScreenResize";

const DisplayContainer = () => {
    // Retrieve current note and actions directly from the store.
    const { currentNote, updateNote, deleteNote, setIsDialogOpen } = useNotesStore();
    const { isDialogAllowed } = useScreenResize();

    const displayContainerRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState(currentNote ? currentNote.content : "");
    const [title, setTitle] = useState(currentNote ? currentNote.title : "");
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    // Update local state when the current note changes.
    useEffect(() => {
        if (currentNote) {
            setContent(currentNote.content);
            setTitle(currentNote.title);
        }
    }, [currentNote]);

    // Save note changes if any.
    const handleSave = useCallback(() => {
        if (!currentNote) {
            toast.error("No note selected.");
            return;
        }
        const strippedTitle = title.trim();
        if (currentNote.title.trim() === strippedTitle && currentNote.content === content) {
            toast.info("No actual changes detected. Skipping update.");
            return;
        }
        // Call store action to update the note.
        updateNote({
            ...currentNote,
            title: strippedTitle,
            content,
        });
        if (setIsDialogOpen) {
            setIsDialogOpen(false);
        }
        console.log("Note auto-saved!");
    }, [currentNote, title, content, updateNote, setIsDialogOpen]);

    // Auto-save on focus loss.
    useEffect(() => {
        const container = displayContainerRef.current;
        if (!container) return;

        const handleFocusIn = () => setIsEditorFocused(true);
        const handleFocusOut = (event: FocusEvent) => {
            if (displayContainerRef.current && !displayContainerRef.current.contains(event.relatedTarget as Node)) {
                handleSave();
                setIsEditorFocused(false);
            }
        };

        container.addEventListener("focusin", handleFocusIn);
        container.addEventListener("focusout", handleFocusOut);

        return () => {
            container.removeEventListener("focusin", handleFocusIn);
            container.removeEventListener("focusout", handleFocusOut);
        };
    }, [handleSave]);

    // Save note on Ctrl+S or Cmd+S.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditorFocused && (event.metaKey || event.ctrlKey) && event.key === "s") {
                event.preventDefault();
                handleSave();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleSave, isEditorFocused]);

    return (
        <div
            className="p-4 bg-white shadow-md rounded-lg h-full flex flex-col gap-y-4 overflow-hidden border-0 md:border md:border-gray-300"
            ref={displayContainerRef}
            tabIndex={0}
        >
            {/* Title & Delete Button */}
            <div className="flex items-start justify-between">
                <NoteTitleEditor title={title} setTitle={setTitle} />
                <div className="flex gap-x-2">
                    <button
                        onClick={() => currentNote && deleteNote(currentNote.id)}
                        className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                    >
                        <FaTrash size={15} />
                    </button>
                    {isDialogAllowed && setIsDialogOpen && (
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                        >
                            <FaX size={13} />
                        </button>
                    )}
                </div>
            </div>

            {/* Note Metadata */}
            <div className="flex-shrink-0 flex flex-col gap-y-2 text-[12px] text-gray-400 font-bold mr-2 text-nowrap overflow-hidden min-w-0">
                {currentNote?.createdAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                        • Created At: {formatDate(currentNote.createdAt)}
                    </p>
                )}
                {currentNote?.updatedAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                        • Last Updated At: {formatDate(currentNote.updatedAt)}
                    </p>
                )}
            </div>

            <NoteContentEditor content={content} setContent={setContent} />

            {/* Save Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"default"}
                        className="w-fit bg-green-500 rounded-full py-3 px-4 ml-auto"
                        onClick={handleSave}
                    >
                        <span className="font-bold">Save</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Ctrl+S or Cmd+S</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default DisplayContainer;
