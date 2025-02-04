import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { Note } from "@/types/note";
import { toast } from "sonner";
import { Button } from "./ui/button";
import sanitizeHtml from "sanitize-html";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";

const NoteCard = ({
    note: initialNote, // ✅ Renaming to prevent conflicts with state
    onEdit,
    onDelete,
    showEditButton,
}: {
    note: Note;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
}) => {
    const [note, setNote] = useState<Note>(initialNote); // ✅ Store note in state
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setNote(initialNote); // ✅ Sync state if the parent updates the note
    }, [initialNote]);

    // ✅ Copy Plain Text (Strips HTML)
    const handleCopyPlainText = async (text: string) => {
        try {
            window.focus(); // Attempt to bring the window into focus
            await navigator.clipboard.writeText(text);
            console.log("Copied to clipboard!");
            onEdit(note.id);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    };

    // ✅ Copy Rich Text (Preserves HTML formatting)
    const handleCopyRichText = () => {
        navigator.clipboard.writeText(note.content).then(() => {
            toast.success("Copied Formatted Text!");
        });
    };

    // ✅ Open Context Menu (Fix for incorrect positioning)
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        onEdit(note.id);

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
        setTimeout(closeContextMenu, 2500);
    };

    // ✅ Close Context Menu
    const closeContextMenu = () => {
        setContextMenu(null);
        window.focus();
    };

    // ✅ Sanitize HTML for Safe Rendering
    const sanitizedContent = sanitizeHtml(note.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "span"]),
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt", "title", "width", "height"],
            span: ["style"],
        },
        allowedSchemes: ["http", "https"],
    });

    return (
        <DropdownMenu open={!!contextMenu} onOpenChange={closeContextMenu}>
            <DropdownMenuTrigger asChild>
                <Card
                    className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 relative overflow-hidden cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-105 
                    h-[120px] w-full sm:h-[140px] sm:w-full md:h-[160px] md:w-full lg:h-[180px] lg:w-full xl:h-[200px] xl:w-full 
                    flex flex-col"
                    onClick={() =>
                        handleCopyPlainText(
                            new DOMParser().parseFromString(note.content, "text/html").body.textContent || ""
                        )
                    } // ✅ Left Click → Copy Plain Text
                    onContextMenu={handleContextMenu} // ✅ Right Click → Open Menu
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <span className="font-semibold overflow-hidden text-nowrap text-ellipsis mr-2 text-normal md:text-lg">
                            {note.name}
                        </span>
                        <div className="flex gap-x-1">
                            {/* Show edit button only when DisplayContainer is hidden */}
                            {showEditButton && (
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(note.id);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 [&_svg]:size-4"
                                >
                                    <FaPenClip />
                                </Button>
                            )}
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(note.id);
                                }}
                                className="text-gray-500 hover:text-gray-700 [&_svg]:size-4"
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    </div>

                    {/* ✅ Render Sanitized HTML Content (Preserves Formatting) */}
                    <div
                        ref={cardRef}
                        className="flex-1 text-normal md:text-lg font-medium mt-4 overflow-hidden text-ellipsis break-words line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
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
                    onClick={() =>
                        handleCopyPlainText(
                            new DOMParser().parseFromString(note.content, "text/html").body.textContent || ""
                        )
                    }
                >
                    Copy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyRichText}>Copy Formatted</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => onDelete(note.id)}>
                    Delete Note
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NoteCard;
