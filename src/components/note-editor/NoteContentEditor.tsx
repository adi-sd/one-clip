import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Toolbar from "@/components/note-editor/Toolbar";
import { useEffect, useState } from "react";
import LinkDialog from "@/components/display-container/LinkDialog";

export default function NoteContentEditor({
    content,
    setContent,
}: {
    content: string;
    setContent: (content: string) => void;
}) {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

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

    // ✅ Update editor content when `content` prop changes (fixes the issue)
    useEffect(() => {
        if (editor && editor.getHTML() !== content) {
            editor.commands.setContent(content, false); // false to avoid unnecessary history entries
        }
    }, [content, editor]);

    return (
        <>
            {/* Note Content Editor */}
            <div className="w-full h-full flex flex-col gap-y-2 rounded-lg border border-gray-300 p-1 bg-gray-50 overflow-hidden">
                {/* Toolbar for formatting */}
                <Toolbar
                    currentNoteContent={content}
                    editor={editor}
                    openLinkDialog={() => setIsLinkDialogOpen(true)}
                />
                {/* Rich Text Editor */}
                <div className="w-full h-full rounded-lg py-2 pl-2 shadow-inner flex overflow-hidden bg-white">
                    <EditorContent editor={editor} className="flex-1 overflow-y-auto scrollbar-minimal text-sm" />
                </div>
            </div>
            {/* Link Dialog */}
            <LinkDialog isOpen={isLinkDialogOpen} setIsOpen={setIsLinkDialogOpen} editor={editor} />
        </>
    );
}
