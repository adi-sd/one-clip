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
import { useState, useRef, useEffect } from "react";
import { copyPlainText, copyRichText, sanitizeNoteContent } from "@/lib/editorUtils";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const NoteCard = ({
    note: initialNote,
    selectNote,
    onEdit,
    onDelete,
    showEditButton,
    showOptionButton,
}: {
    note: Note;
    selectNote: (id: string) => void;
    onEdit: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
    showOptionButton: boolean;
}) => {
    const [note, setNote] = useState<Note>(initialNote);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setNote(initialNote);
    }, [initialNote]);

    // ✅ Sanitize HTML for Safe Rendering
    const sanitizedContent = sanitizeNoteContent(note.content);

    // Card Click Handler
    const handleCardClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // ✅ Prevent triggering context menu
        if (showEditButton) {
            selectNote(note.id);
        }
        copyPlainText(new DOMParser().parseFromString(note.content, "text/html").body.textContent || "");
        console.log("Copied to clipboard!");
    };

    // ✅ Open Context Menu (Fix for incorrect positioning)
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!cardRef.current) return; // Ensure the card reference exists

        const cardRect = cardRef.current.getBoundingClientRect();
        const menuWidth = 150; // Approximate menu width
        const menuHeight = 120; // Approximate menu height

        let x = cardRect.right - menuWidth; // Position at bottom-right
        let y = cardRect.bottom; // Below the card

        // Prevent overflow from the viewport
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (x + menuWidth > screenWidth) x = screenWidth - menuWidth - 10; // Prevent right overflow
        if (y + menuHeight > screenHeight) y = screenHeight - menuHeight - 10; // Prevent bottom overflow

        setContextMenu({ x, y });
        contextMenuRef.current?.focus();
        setTimeout(closeContextMenu, 2000);
    };

    // ✅ Close Context Menu
    const closeContextMenu = () => {
        setContextMenu(null);
        window.focus();
    };

    // ✅ Handle button click (Does NOT trigger card click)
    const handleButtonClick = (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        action: "edit" | "delete" | "options" | "copy-normal" | "copy-formatted"
    ) => {
        event.stopPropagation();
        console.log(`${action} button clicked`);
        switch (action) {
            case "edit":
                selectNote(note.id);
                break;
            case "copy-normal":
                copyPlainText(note.content);
                break;
            case "copy-formatted":
                copyRichText(note.content);
                break;
            case "delete":
                onDelete(note.id);
                break;
            case "options":
                handleContextMenu(event); // ✅ Call existing function for positioning
                break;
        }
    };

    // ✅ Toggle One-Click Copy using ShadCN Switch
    const toggleOneClickCopy = () => {
        const updatedNote = { ...note, disableOneClickCopy: !note.disableOneClickCopy };
        setNote(updatedNote);
        onEdit(updatedNote); // ✅ Update Note using `onEdit`
        toast.success(`One-Click Copy ${updatedNote.disableOneClickCopy ? "Disabled" : "Enabled"} for this Note!`);
    };

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={closeContextMenu}>
            <DropdownMenuTrigger asChild>
                <Card
                    className="bg-white md:hover:scale-[102%] shadow-sm md:shadow-md p-3 rounded-lg cursor-pointer transform transition-transform duration-100 ease-in-out h-[100px] w-full sm:h-[120px] md:h-[140px] lg:h-[160px] xl:h-[180px] flex flex-col items-center justify-between gap-y-1 sm:gap-y-2 border-gray-300 overflow-hidden"
                    ref={cardRef}
                    onClick={handleCardClick} // ✅ Left Click → Copy Plain Text
                    onContextMenu={handleContextMenu} // ✅ Right Click → Open Menu
                >
                    {/* Header and Buttons */}
                    <div className="w-full h-fit flex flex-row items-center justify-between">
                        <div className="flex items-center gap-x-1 text-[10px] text-gray-400 font-bold mr-2 text-nowrap overflow-hidden min-w-0">
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                                {note.title}
                            </p>
                        </div>
                        <div className="h-full flex items-center justify-center gap-x-2 m-0">
                            {showEditButton ? null : (
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e, "edit");
                                    }}
                                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                                >
                                    <FaPenClip size={12} />
                                </button>
                            )}
                            {showOptionButton ? null : (
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e, "options");
                                    }}
                                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                                >
                                    <TiThMenu size={12} />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    handleButtonClick(e, "delete");
                                }}
                                className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
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

            {/* ✅ Right-Click Context Menu (Now Positions Correctly) */}
            <DropdownMenuContent align="end" sideOffset={5} ref={contextMenuRef}>
                <DropdownMenuItem
                    onClick={(e) => {
                        handleButtonClick(e, "copy-normal");
                    }}
                >
                    Copy
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        handleButtonClick(e, "copy-formatted");
                    }}
                >
                    Copy Formatted
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        handleButtonClick(e, "edit");
                    }}
                >
                    Edit Note
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full gap-x-2">
                        <span className="text-sm">One-Click Copy</span>
                        <Switch checked={note.disableOneClickCopy} onCheckedChange={toggleOneClickCopy} />
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-500"
                    onClick={(e) => {
                        handleButtonClick(e, "delete");
                    }}
                >
                    Delete Note
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NoteCard;
