import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Toolbar from "@/components/toolbar/Toolbar";
import { useEffect, useRef, useState } from "react";
import LinkDialog from "@/components/note-editor/LinkDialog";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function NoteContentEditor({
    content,
    setContent,
}: {
    content: string;
    setContent: (content: string) => void;
}) {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [selectedText, setSelectedText] = useState<string>("");
    const noteEditorRef = useRef<HTMLDivElement | null>(null);

    // Initialize TipTap editor
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
            TaskList,
            TaskItem,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Editor focus handling
    const handleFocusEditor = (event: React.MouseEvent<HTMLDivElement>) => {
        if (editor) {
            const clickTarget = event.target as HTMLElement;
            // Prevent focusing if clicking inside the editor content
            if (!clickTarget.closest(".tiptap-editor")) {
                editor.commands.focus("end"); // Focus only when clicking outside
            }
        }
    };

    // Function to open dialog and capture selected text
    const openLinkDialog = () => {
        if (!editor) return;

        const selection = editor.state.selection;
        const text = editor.view.state.doc.textBetween(selection.from, selection.to, " ").trim();

        // Prevent opening dialog if no text is selected
        if (!text) {
            toast.error("Please select text before adding a link.");
            return;
        }

        setSelectedText(text);
        setIsLinkDialogOpen(true);
    };

    // Update editor content when `content` prop changes (fixes the issue)
    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    return (
        <div className="w-full h-full overflow-hidden relative" ref={noteEditorRef}>
            {/* Note Content Editor */}
            <div className="w-full h-full flex flex-col gap-y-2 rounded-lg border border-gray-300 p-1 bg-gray-50 overflow-hidden">
                {/* Toolbar for formatting */}
                <Toolbar currentNoteContent={content} editor={editor} openLinkDialog={openLinkDialog} />
                {/* Rich Text Editor */}
                <div
                    className="w-full h-full rounded-lg py-2 pl-2 shadow-inner flex bg-white overflow-y-auto scrollbar-minimal"
                    onClick={handleFocusEditor}
                >
                    <EditorContent editor={editor} className="h-fit flex-1 text-sm tiptap-editor" />
                </div>
            </div>

            {/* Open Dialog inside noteEditorRef with selected text */}
            {noteEditorRef.current &&
                isLinkDialogOpen &&
                createPortal(
                    <LinkDialog
                        isOpen={isLinkDialogOpen}
                        setIsOpen={setIsLinkDialogOpen}
                        editor={editor}
                        selectedText={selectedText}
                    />,
                    noteEditorRef.current
                )}
        </div>
    );
}
