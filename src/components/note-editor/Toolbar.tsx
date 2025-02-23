import { Editor } from "@tiptap/react";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline, FaLink, FaLinkSlash } from "react-icons/fa6";
import { MdOutlineContentCopy, MdOutlineFileCopy } from "react-icons/md";
import { PiListBold, PiListBulletsBold, PiListNumbersBold, PiGlobeBold } from "react-icons/pi";
import { copyPlainText, copyRichText } from "@/lib/editorUtils";
import ToolbarButton from "@/components/note-editor/ToolbarButton";
import ToolbarButtonCombo from "./ToolbarButtonCombo";

const Toolbar = ({
    currentNoteContent,
    editor,
    openLinkDialog,
}: {
    currentNoteContent: string;
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

            {/* Dropdown Menu for List Options */}
            <ToolbarButtonCombo
                tooltip="Hyperlink"
                trigger={<PiGlobeBold size={14} />}
                options={[
                    {
                        icon: <FaLink size={14} />,
                        isActive: editor.isActive("link"),
                        onClick: () => openLinkDialog(),
                    },
                    {
                        icon: <FaLinkSlash size={14} />,
                        isActive: false,
                        onClick: () => editor.chain().focus().unsetLink().run(),
                    },
                ]}
            />

            {/* Dropdown Menu for List Options */}
            <ToolbarButtonCombo
                tooltip="List"
                trigger={<PiListBold size={14} />}
                options={[
                    {
                        icon: <PiListBulletsBold size={14} />,
                        isActive: editor.isActive("bulletList"),
                        onClick: () => editor.chain().focus().toggleBulletList().run(),
                    },
                    {
                        icon: <PiListNumbersBold size={14} />,
                        isActive: editor.isActive("orderedList"),
                        onClick: () => editor.chain().focus().toggleOrderedList().run(),
                    },
                ]}
            />

            <ToolbarButton
                icon={<MdOutlineContentCopy size={12} />}
                tooltip="Copy Content"
                isActive={false}
                onClick={() => copyPlainText(currentNoteContent)}
            />
            <ToolbarButton
                icon={<MdOutlineFileCopy size={12} />}
                tooltip="Copy Formatted"
                isActive={false}
                onClick={() => copyRichText(currentNoteContent)}
            />
        </div>
    );
};

export default Toolbar;
