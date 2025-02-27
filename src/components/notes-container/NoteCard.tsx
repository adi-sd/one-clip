"use client";

import { useState, useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { Note } from "@/types/note";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { copyPlainText, copyRichText, sanitizeNoteContent } from "@/lib/editorUtils";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNotesStore } from "@/store/noteStore";
import { useScreenResize } from "@/hooks/useScreenResize";

// Updated NoteCard: using store actions directly
const NoteCard = ({
    note: initialNote,
    setIsDialogOpen,
}: {
    note: Note;
    setIsDialogOpen: (value: boolean) => void;
}) => {
    const { setCurrentNote, updateNoteFlag, deleteNote } = useNotesStore();
    const { isLargeScreen } = useScreenResize();

    const [note, setNote] = useState<Note>(initialNote);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
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
        copyPlainText(new DOMParser().parseFromString(note.content, "text/html").body.textContent || "");
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
        action: "edit" | "delete" | "options" | "copy-normal" | "copy-formatted" | "copy-flag"
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
            case "copy-flag":
                updateNoteFlag(note.id, "disableOneClickCopy", !note.disableOneClickCopy);
                break;
        }
    };

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={() => setContextMenu(null)}>
            <DropdownMenuTrigger asChild>
                <Card
                    ref={cardRef}
                    className="bg-white md:hover:scale-[102%] shadow-sm md:shadow-md p-3 rounded-lg cursor-pointer transform transition-transform duration-100 ease-in-out h-[100px] w-full sm:h-[120px] md:h-[140px] lg:h-[160px] xl:h-[180px] flex flex-col items-center justify-between gap-y-1 sm:gap-y-2 border-gray-300 overflow-hidden"
                    onClick={handleCardClick}
                    onContextMenu={handleContextMenu}
                >
                    {/* Header */}
                    <div className="w-full flex items-center justify-between">
                        <div className="text-[10px] text-gray-400 font-bold truncate">{note.title}</div>
                        <div className="flex items-center gap-x-2">
                            {!isLargeScreen && (
                                <>
                                    <button
                                        onClick={(e) => handleButtonClick(e, "edit")}
                                        className="p-1 hover:bg-gray-300 rounded-sm text-gray-400 hover:text-gray-500"
                                    >
                                        <FaPenClip size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => handleButtonClick(e, "options")}
                                        className="p-1 hover:bg-gray-300 rounded-sm text-gray-400 hover:text-gray-500"
                                    >
                                        <TiThMenu size={12} />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={(e) => handleButtonClick(e, "delete")}
                                className="p-1 hover:bg-gray-300 rounded-sm text-gray-400 hover:text-gray-500"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="w-full h-[50%] overflow-hidden">
                        <div
                            className="text-[14px] break-words line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    </div>

                    {/* Footer with tooltip for dates */}
                    <div className="w-full flex justify-end">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-[10px] text-gray-400 font-bold truncate">
                                    {formatDateShort(note.updatedAt)}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="start">
                                <p>Created: {formatDate(note.createdAt)}</p>
                                <p>Updated: {formatDate(note.updatedAt)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} ref={contextMenuRef}>
                <DropdownMenuItem onClick={(e) => handleButtonClick(e, "copy-normal")}>Copy</DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleButtonClick(e, "copy-formatted")}>
                    Copy Formatted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleButtonClick(e, "edit")}>Edit Note</DropdownMenuItem>
                <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sm">One-Click Copy</span>
                        <Switch checked={note.disableOneClickCopy} onClick={(e) => handleButtonClick(e, "copy-flag")} />
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={(e) => handleButtonClick(e, "delete")}>
                    Delete Note
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NoteCard;
