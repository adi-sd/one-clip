import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { Note } from "@/types/note";
import sanitizeHtml from "sanitize-html";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { copyPlainText, copyRichText } from "@/lib/editorUtils";
import { FaCircle } from "react-icons/fa";
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
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        if (showEditButton) {
            selectNote(note.id);
        }

        if (!cardRef.current) return;

        const cardRect = cardRef.current.getBoundingClientRect();

        // Calculate the relative position inside the card
        let x = event.clientX - cardRect.left;
        let y = event.clientY - cardRect.top;

        // Prevent overflow
        const maxX = cardRect.width - 130; // Adjust based on menu width
        const maxY = cardRect.height - 120; // Adjust based on menu height

        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;

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
        event: React.MouseEvent,
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
                handleContextMenu(event);
                break;
        }
    };

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={closeContextMenu}>
            <DropdownMenuTrigger asChild>
                <Card
                    className="bg-white md:hover:scale-[102%] shadow-sm md:shadow-md p-3 rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out h-[100px] w-full sm:h-[140px] sm:w-full md:h-[160px] md:w-full lg:h-[180px] lg:w-full xl:h-[200px] xl:w-full flex flex-col gap-y-2 border-gray-300"
                    onClick={handleCardClick} // ✅ Left Click → Copy Plain Text
                    onContextMenu={handleContextMenu} // ✅ Right Click → Open Menu
                >
                    {/* Header */}
                    <div className="flex flex-row items-center justify-between w-full h-fit">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-x-1 text-[12px] text-gray-300 font-bold font-mono mr-2 text-nowrap overflow-hidden min-w-0">
                                    <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                                        {note.name} • {formatDate(note.createdAt)}
                                    </p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent align="center">
                                <p className="whitespace-nowrap font-mono">
                                    {note.name} • {formatDate(note.createdAt)}
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
                                    className=" text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-300 rounded-sm"
                                >
                                    <FaPenClip size={12} />
                                </button>
                            )}
                            {showOptionButton ? null : (
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e, "options");
                                    }}
                                    className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-300 rounded-sm"
                                >
                                    <TiThMenu size={12} />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    handleButtonClick(e, "delete");
                                }}
                                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-300 rounded-sm"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex-1 text-[14px]">
                        {/* ✅ Render Sanitized HTML Content (Preserves Formatting) */}
                        <div
                            ref={cardRef}
                            className="overflow-hidden text-ellipsis break-words line-clamp-2 sm:line-clamp-3 md:line-clamp-4 lg:line-clamp-5 xl:line-clamp-6"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    </div>
                </Card>
            </DropdownMenuTrigger>

            {/* ✅ Right-Click Context Menu (Now Positions Correctly) */}
            <DropdownMenuContent
                align="start"
                sideOffset={5}
                style={{
                    position: "absolute",
                    left: contextMenu?.x ?? "auto",
                    top: contextMenu?.y ?? "auto",
                }}
                ref={contextMenuRef}
            >
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
