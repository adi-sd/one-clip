import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";

const LinkDialog = ({
    isOpen,
    setIsOpen,
    editor,
    selectedText,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    editor: Editor | null;
    selectedText: string;
}) => {
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState(selectedText || "");
    const [isEditing, setIsEditing] = useState(false); // ✅ Tracks if a link exists

    useEffect(() => {
        if (!editor || !isOpen) return;

        const existingLink = editor.getAttributes("link").href || "";
        setIsEditing(existingLink !== ""); // ✅ Detects if a link exists

        setLinkUrl(existingLink);
        setLinkText(selectedText || "");
    }, [isOpen, editor, selectedText]);

    const applyLink = () => {
        if (!editor) return;

        if (linkUrl.trim() === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setIsOpen(false);
    };

    const removeLink = () => {
        if (!editor) return;
        editor.chain().focus().unsetLink().run();
        setIsOpen(false);
    };

    return (
        <Dialog key="link-dialog" open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-full max-w-sm overflow-hidden flex flex-col" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Link" : "Add Link"}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center gap-x-1 text-[16px] font-bold mr-2 text-nowrap overflow-hidden min-w-0">
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 truncate">
                            <span className="text-gray-400">• For, </span>
                            {linkText}
                        </p>
                    </div>

                    <div className="px-1">
                        <Input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="Enter a URL"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        {isEditing && (
                            <Button variant="destructive" onClick={removeLink}>
                                Remove Link
                            </Button>
                        )}
                        <Button onClick={applyLink}>{isEditing ? "Update Link" : "Add Link"}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LinkDialog;
