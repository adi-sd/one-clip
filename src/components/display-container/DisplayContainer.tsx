"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Note } from "@/types/note";
import { FaTrash } from "react-icons/fa";
import NoteTitleEditor from "@/components/note-editor/NoteTitleEditor";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import NoteContentEditor from "../note-editor/NoteContentEditor";
import { toast } from "sonner";

const DisplayContainer = ({
    currentNote,
    onEdit,
    onDelete,
    setIsDialogOpen,
}: {
    currentNote: Note;
    onEdit: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
    setIsDialogOpen?: (val: boolean) => void;
}) => {
    const displayContainerRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState(currentNote.content);
    const [title, setTitle] = useState(currentNote.title);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    useEffect(() => {
        setContent(currentNote.content);
        setTitle(currentNote.title);
    }, [currentNote]);

    // ✅ Save note function
    const handleSave = useCallback(() => {
        // ✅ Function to remove invisible HTML while keeping rich text content
        const stripHtmlForComparison = (html: string) => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.body.textContent?.replace(/\u00A0/g, "").trim() || ""; // ✅ Removes non-visible spaces
        };

        const strippedTitle = title.trim(); // ✅ Title is plain text, so normal trim
        const strippedContentForComparison = stripHtmlForComparison(content); // ✅ Compare clean content

        // ✅ Check if content has actually changed
        if (
            currentNote.title.trim() === strippedTitle &&
            stripHtmlForComparison(currentNote.content) === strippedContentForComparison
        ) {
            toast.info("No actual changes detected. Skipping update.");
            return; // ✅ Prevent unnecessary API calls
        }

        onEdit({
            ...currentNote,
            title: strippedTitle, // ✅ Save clean title
            content, // ✅ Save full rich text content
        });

        if (setIsDialogOpen) {
            setIsDialogOpen(false);
        }
        console.log("Note auto-saved!");
    }, [currentNote, title, content, onEdit, setIsDialogOpen]);

    // ✅ Detect when the display container **loses focus**
    useEffect(() => {
        const container = displayContainerRef.current;
        if (!container) return;

        const handleFocusIn = () => setIsEditorFocused(true);
        const handleFocusOut = (event: FocusEvent) => {
            if (displayContainerRef.current && !displayContainerRef.current.contains(event.relatedTarget as Node)) {
                handleSave(); // ✅ Auto-save when losing focus
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

    // ✅ Handle Cmd + S / Ctrl + S only when display container is focused
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditorFocused && (event.metaKey || event.ctrlKey) && event.key === "s") {
                event.preventDefault(); // Prevent browser save action
                handleSave();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
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
                <button
                    onClick={() => onDelete(currentNote?.id || "")}
                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm [&_svg]:size-4"
                >
                    <FaTrash size={15} />
                </button>
            </div>

            <div className="flex-shrink-0 flex flex-col gap-y-2 text-[12px] text-gray-400 font-bold mr-2 text-nowrap overflow-hidden min-w-0">
                {currentNote.createdAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                        • Created At: {formatDate(currentNote.createdAt)}
                    </p>
                )}
                {currentNote.updatedAt && (
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                        • Last Updated At: {formatDate(currentNote.updatedAt)}
                    </p>
                )}
            </div>

            <NoteContentEditor content={content} setContent={setContent}></NoteContentEditor>

            {/* Save Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"default"}
                        className="w-fit bg-green-500 rounded-full [&_svg]:size-6 py-3 px-4 ml-auto"
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
