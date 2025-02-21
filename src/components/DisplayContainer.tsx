"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Note } from "@/types/note";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { FaTrash } from "react-icons/fa";
import Toolbar from "./Toolbar";
import LinkDialog from "./LinkDialog";
import TitleEditor from "./TitleEditor";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const DisplayContainer = ({
    selectedNote,
    onEdit,
    onDelete,
    setIsDialogOpen,
}: {
    selectedNote: Note;
    onEdit: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
    setIsDialogOpen?: (val: boolean) => void;
}) => {
    const displayContainerRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState(selectedNote?.name || "");
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    // const isNewNode = selectedNote?.name === "New Note";

    // ✅ Initialize TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                HTMLAttributes: {
                    class: "custom-link",
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        setContent(selectedNote?.content || "");
        setTitle(selectedNote?.name || "");
        if (editor && selectedNote) {
            editor.commands.setContent(selectedNote.content);
        }
    }, [editor, selectedNote]);

    // ✅ Save note function
    const handleSave = useCallback(() => {
        if (selectedNote) {
            onEdit({ ...selectedNote, content, name: title });
        }
        if (setIsDialogOpen) {
            setIsDialogOpen(false);
        }
        console.log("Note auto-saved!");
    }, [selectedNote, content, title, onEdit, setIsDialogOpen]);

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
            className="p-4 md:p-6 bg-white shadow-md rounded-lg h-full flex flex-col gap-y-2 overflow-hidden"
            ref={displayContainerRef}
            tabIndex={0}
        >
            {/* Title & Delete Button */}
            <div className="flex items-start justify-between mb-3">
                <TitleEditor title={title} setTitle={setTitle} />
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => onDelete(selectedNote?.id || "")}
                    className="text-gray-500 hover:text-gray-700 [&_svg]:size-4"
                >
                    <FaTrash />
                </Button>
            </div>

            {/* Toolbar for formatting */}
            <Toolbar note={selectedNote} editor={editor} openLinkDialog={() => setIsLinkDialogOpen(true)} />

            {/* Rich Text Editor */}
            <div className="w-full h-full border border-gray-300 rounded-lg p-2 shadow-inner focus:ring-2 focus:ring-green-500 flex flex-col overflow-hidden">
                <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
            </div>

            {/* Save Button */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={"default"}
                        className="w-fit bg-green-500 rounded-full [&_svg]:size-6 py-3 px-4 ml-auto mt-2"
                        onClick={handleSave}
                    >
                        <span className="text-lg font-semibold">Save</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Ctrl + S or Cmd + S</p>
                </TooltipContent>
            </Tooltip>

            {/* Link Dialog */}
            <LinkDialog isOpen={isLinkDialogOpen} setIsOpen={setIsLinkDialogOpen} editor={editor} />
        </div>
    );
};

export default DisplayContainer;
