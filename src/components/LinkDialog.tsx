import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/react";

const LinkDialog = ({
    isOpen,
    setIsOpen,
    editor,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    editor: Editor | null;
}) => {
    const [linkUrl, setLinkUrl] = useState("");

    const applyLink = () => {
        if (!editor) return;
        if (linkUrl.trim() === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={applyLink}>Apply</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LinkDialog;
