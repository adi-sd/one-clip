import { Note } from "@/types/note";
import { Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink, FaLinkSlash } from "react-icons/fa6";
import { MdOutlineContentCopy, MdOutlineFileCopy } from "react-icons/md";
import { copyPlainText, copyRichText } from "@/lib/editorUtils";
import ToolbarButton from "@/components/note-editor/ToolbarButton";

const Toolbar = ({
    currentNote,
    editor,
    openLinkDialog,
}: {
    currentNote: Note;
    editor: Editor | null;
    openLinkDialog: () => void;
}) => {
    if (!editor) return null;

    return (
        <div className="w-fit flex items-center justify-center gap-x-2 shadow-inner rounded-full p-1 bg-white">
            <ToolbarButton
                icon={<FaBold size={12} />}
                tooltip="Bold"
                isActive={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
            />

            <ToolbarButton
                icon={<FaItalic size={12} />}
                tooltip="Italic"
                isActive={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            />

            <ToolbarButton
                icon={<FaStrikethrough size={12} />}
                tooltip="Strike Through"
                isActive={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            />

            <ToolbarButton
                icon={<FaUnderline size={12} />}
                tooltip="Underline"
                isActive={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            />

            <ToolbarButton
                icon={<FaLink size={12} />}
                tooltip="Hyperlink"
                isActive={editor.isActive("link")}
                onClick={openLinkDialog}
            />

            <ToolbarButton
                icon={<FaLinkSlash size={12} />}
                tooltip="Remove Hyperlink"
                isActive={false} // This action is always available
                onClick={() => editor.chain().focus().unsetLink().run()}
            />

            <ToolbarButton
                icon={<MdOutlineContentCopy size={12} />}
                tooltip="Copy Content"
                isActive={false} // This action is always available
                onClick={() => copyPlainText(currentNote.content)}
            />

            <ToolbarButton
                icon={<MdOutlineFileCopy size={12} />}
                tooltip="Copy Formatted"
                isActive={false} // This action is always available
                onClick={() => copyRichText(currentNote.content)}
            />
        </div>
    );
};

export default Toolbar;
