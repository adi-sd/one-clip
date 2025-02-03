import { Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink } from "react-icons/fa";
import { FaLinkSlash } from "react-icons/fa6";

const Toolbar = ({ editor, openLinkDialog }: { editor: Editor | null; openLinkDialog: () => void }) => {
    if (!editor) return null;

    return (
        <div className="flex gap-4 pb-2 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 border border-gray-500 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 border border-gray-500 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 border border-gray-500 rounded ${editor.isActive("strike") ? "bg-gray-300" : ""}`}
            >
                <FaStrikethrough />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 border border-gray-500 rounded ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
            >
                <FaUnderline />
            </button>
            <button
                onClick={openLinkDialog}
                className={`p-2 border border-gray-500 rounded ${editor.isActive("link") ? "bg-gray-300" : ""}`}
            >
                <FaLink />
            </button>
            <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="p-2 border border-gray-500 rounded"
            >
                <FaLinkSlash />
            </button>
        </div>
    );
};

export default Toolbar;
