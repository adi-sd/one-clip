"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaTrash, FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink } from "react-icons/fa";
import { FaLinkSlash } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DisplayContainer = ({
    selectedNote,
    onEdit,
    onDelete,
}: {
    selectedNote: Note | null;
    onEdit: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
}) => {
    const [content, setContent] = useState("");
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    // ✅ Initialize TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false, // Prevent auto opening, we'll handle it manually
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                HTMLAttributes: {
                    class: "custom-link", // ✅ Apply Tailwind styles
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML()); // Store HTML content
        },
        editorProps: {
            handleClick: (_view, pos, event) => {
                if ((event.metaKey || event.ctrlKey) && editor?.isActive("link")) {
                    const url = editor.getAttributes("link").href;
                    if (url) window.open(url, "_blank"); // ✅ Open in new tab
                }
            },
            
        },
    });

    const openLinkDialog = () => {
        const previousUrl = editor?.getAttributes("link").href || "";
        setLinkUrl(previousUrl);
        setIsLinkDialogOpen(true);
    };

    const applyLink = () => {
        if (!editor) return;
        if (linkUrl.trim() === "") {
            // Remove link if URL is empty
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            // Ensure the editor is focused before setting the link
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setIsLinkDialogOpen(false); // Close modal
    };

    useEffect(() => {
        setContent(selectedNote?.content || "");
        if (editor && selectedNote) {
            editor.commands.setContent(selectedNote.content);
        }
    }, [editor, selectedNote]);

    if (!selectedNote) {
        return <p className="text-gray-500">Select a note to view or edit.</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg h-full flex flex-col">
            {/* Title & Delete Button */}
            <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold">{selectedNote.name}</h2>
                <button
                    onClick={() => onDelete(selectedNote.id)}
                    className="text-gray-500 hover:text-gray-700 h-[28px] w-[28px] flex items-center justify-center"
                >
                    <FaTrash size={20} />
                </button>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex gap-4 pb-2 mb-2">
                <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("bold") ? "bg-gray-300" : ""}`}
                >
                    <FaBold />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("italic") ? "bg-gray-300" : ""}`}
                >
                    <FaItalic />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("strike") ? "bg-gray-300" : ""}`}
                >
                    <FaStrikethrough />
                </button>
                <button
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("underline") ? "bg-gray-300" : ""}`}
                >
                    <FaUnderline />
                </button>
                <button
                    onClick={openLinkDialog}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("link") ? "bg-gray-300" : ""}`}
                >
                    <FaLink />
                </button>
                <button
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                    disabled={!editor?.isActive("link")}
                    className={`p-2 border border-gray-500 rounded ${editor?.isActive("link") ? "bg-gray-300" : ""}`}
                >
                    <FaLinkSlash />
                </button>
            </div>

            {/* Rich Text Editor */}
            <div className="w-full h-full border border-gray-300 rounded-lg p-2 shadow-inner focus:ring-2 focus:ring-green-500 flex flex-col">
                <EditorContent editor={editor} className="flex-1 overflow-auto" />
            </div>

            {/* Save Button */}
            <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-end"
                onClick={() => onEdit({ ...selectedNote, content })}
            >
                Save
            </button>

            {/* Link Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="w-full max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add or Edit Link</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="Enter a URL"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setIsLinkDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={applyLink}>Apply</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DisplayContainer;
