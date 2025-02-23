import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { Note } from "@/types/note";
import sanitizeHtml from "sanitize-html";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { copyPlainText, copyRichText } from "@/lib/editorUtils";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NoteCard = ({
    note: initialNote, // ✅ Renaming to prevent conflicts with state
    selectNote,
    onDelete,
    showEditButton,
    showOptionButton,
}: {
    note: Note;
    selectNote: (id: string) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
    showOptionButton: boolean;
}) => {
    const [note, setNote] = useState<Note>(initialNote); // ✅ Store note in state
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setNote(initialNote); // ✅ Sync state if the parent updates the note
    }, [initialNote]);

    // ✅ Sanitize HTML for Safe Rendering
    const sanitizedContent = sanitizeHtml(note.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "span"]),
        allowedAttributes: {
            // a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            span: ["style"],
        },
        allowedSchemes: ["http", "https"],
    });

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

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={closeContextMenu}>
            <DropdownMenuTrigger asChild>
                <Card
                    className="bg-white md:hover:scale-[102%] shadow-sm md:shadow-md p-3 rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out h-[80px] w-full sm:h-[120px] sm:w-full md:h-[140px] md:w-full lg:h-[160px] lg:w-full xl:h-[180px] xl:w-full flex flex-col gap-y-3 border-gray-300"
                    ref={cardRef}
                    onClick={handleCardClick} // ✅ Left Click → Copy Plain Text
                    onContextMenu={handleContextMenu} // ✅ Right Click → Open Menu
                >
                    {/* Header */}
                    <div className="flex flex-row items-center justify-between w-full h-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-x-1 text-[12px] text-gray-400 font-bold mr-2 text-nowrap overflow-hidden min-w-0">
                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                                        {note.title} • {formatDate(note.createdAt)}
                                    </p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                                <p className="whitespace-nowrap">
                                    {note.title} • {formatDate(note.createdAt)}
                                </p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="h-full flex items-center justify-center gap-x-2 m-0">
                            {/* Show edit button only when DisplayContainer is hidden */}
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

                    <div className="w-full flex-1 text-[14px]">
                        {/* ✅ Render Sanitized HTML Content (Preserves Formatting) */}
                        <div
                            ref={cardRef}
                            className="overflow-hidden text-ellipsis break-words line-clamp-1 sm:line-clamp-2 md:line-clamp-3 lg:line-clamp-4 xl:line-clamp-5"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
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
