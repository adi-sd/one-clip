"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Note } from "@/types/note";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { copyPlainText, copyRichText, sanitizeNoteContent } from "@/lib/editorUtils";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNotesStore } from "@/store/noteStore";
import NoteCardButtons from "./NoteCardButtons";
import NoteCardContextMenu from "./NoteCradContextMenu";

export type NoteCardActionType = "edit" | "delete" | "options" | "copy-normal" | "copy-formatted" | "select";

// Updated NoteCard: using store actions directly
const NoteCard = ({ note: initialNote }: { note: Note }) => {
    const { setCurrentNote, deleteNote, setIsDialogOpen } = useNotesStore();

    const [note, setNote] = useState<Note>(initialNote);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const cardRef = useRef<HTMLDivElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    // Sync local note state if initialNote changes.
    useEffect(() => {
        setNote(initialNote);
    }, [initialNote]);

    const sanitizedContent = sanitizeNoteContent(note.content);

    // On left click, set current note and copy plain text.
    const handleCardClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setCurrentNote(note);
        if (note.oneClickCopy) {
            copyPlainText(new DOMParser().parseFromString(note.content, "text/html").body.textContent || "");
        }
    };

    // Calculate context menu position and open it.
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!cardRef.current) return;
        const cardRect = cardRef.current.getBoundingClientRect();
        const menuWidth = 150; // approximate width
        const menuHeight = 120; // approximate height
        let x = cardRect.right - menuWidth;
        let y = cardRect.bottom;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        if (x + menuWidth > screenWidth) x = screenWidth - menuWidth - 10;
        if (y + menuHeight > screenHeight) y = screenHeight - menuHeight - 10;
        setContextMenu({ x, y });
        contextMenuRef.current?.focus();
        setTimeout(() => setContextMenu(null), 2500);
    };

    // Handle button actions.
    const handleButtonClick = (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        action: NoteCardActionType
    ) => {
        event.stopPropagation();
        switch (action) {
            case "edit":
                setIsDialogOpen(true);
                setCurrentNote(note);
                break;
            case "copy-normal":
                copyPlainText(note.content);
                break;
            case "copy-formatted":
                copyRichText(note.content);
                break;
            case "delete":
                deleteNote(note.id);
                break;
            case "options":
                handleContextMenu(event);
                break;
            case "select":
                setIsSelected(!isSelected);
                break;
        }
    };

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={() => setContextMenu(null)}>
            <DropdownMenuTrigger asChild>
                <Card
                    className={`group bg-white md:hover:scale-[102%] shadow-sm md:shadow-md p-3 rounded-lg cursor-pointer transform transition-transform duration-100 ease-in-out h-[100px] w-full sm:h-[120px] md:h-[140px] lg:h-[160px] xl:h-[180px] flex flex-col items-center justify-between gap-y-1 sm:gap-y-2 border-gray-300 overflow-hidden ${isSelected ? "border-2 border-green-500" : ""}`}
                    ref={cardRef}
                    onClick={handleCardClick}
                    onContextMenu={handleContextMenu}
                >
                    {/* Header */}
                    <div className="w-full flex items-center justify-between">
                        <div className="text-[10px] text-gray-400 font-bold truncate">{note.title}</div>
                        <NoteCardButtons handleButtonClick={handleButtonClick} isNoteSelected={isSelected} />
                    </div>

                    {/* Note Content */}
                    <div className="w-full h-[50%] flex-shrink-0 overflow-hidden">
                        <div
                            ref={cardRef}
                            className=" text-[14px] text-ellipsis break-words line-clamp-1 md:line-clamp-2 lg:line-clamp-3 xl:line-clamp-4 ProseMirror"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    </div>

                    {/* Note Footer */}
                    <div className="w-full h-fit flex-shrink-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center justify-end gap-x-1 text-[10px] text-gray-400 font-bold text-nowrap overflow-hidden min-w-0">
                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                                        {formatDateShort(note.updatedAt)}
                                    </p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="start">
                                <p className="whitespace-nowrap">• Created At: {formatDate(note.createdAt)}</p>
                                <p className="whitespace-nowrap">• Last Updated At: {formatDate(note.updatedAt)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} ref={contextMenuRef}>
                <NoteCardContextMenu currentNote={note} handleButtonClick={handleButtonClick} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NoteCard;
