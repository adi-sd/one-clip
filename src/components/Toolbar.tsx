import { Note } from "@/types/note";
import { Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink } from "react-icons/fa6";
import { FaLinkSlash } from "react-icons/fa6";
import { MdOutlineContentCopy, MdOutlineFileCopy } from "react-icons/md";
import { copyPlainText, copyRichText } from "@/lib/editorUtils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Toolbar = ({
    note,
    editor,
    openLinkDialog,
}: {
    note: Note;
    editor: Editor | null;
    openLinkDialog: () => void;
}) => {
    if (!editor) return null;

    return (
        <div className="flex items-center justify-between mb-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 border border-gray-400 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
                    >
                        <FaBold />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Bold</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 border border-gray-400 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
                    >
                        <FaItalic />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Italic</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-2 border border-gray-400 rounded ${editor.isActive("strike") ? "bg-gray-300" : ""}`}
                    >
                        <FaStrikethrough />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Strike Through</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 border border-gray-400 rounded ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
                    >
                        <FaUnderline />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Underline</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={openLinkDialog}
                        className={`p-2 border border-gray-400 rounded ${editor.isActive("link") ? "bg-gray-300" : ""}`}
                    >
                        <FaLink />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Hyperlink</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="p-2 border border-gray-400 rounded"
                    >
                        <FaLinkSlash />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Remove Hyperlink</p>
                </TooltipContent>
            </Tooltip>

            {/* Copy Text */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => copyPlainText(note.content)}
                        className="p-2 border border-gray-400 rounded"
                    >
                        <MdOutlineContentCopy />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Copy Content</p>
                </TooltipContent>
            </Tooltip>

            {/* Copy Unformatted Text */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={() => copyRichText(note.content)} className="p-2 border border-gray-400 rounded">
                        <MdOutlineFileCopy />
                    </button>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>Copy Formatted</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default Toolbar;
