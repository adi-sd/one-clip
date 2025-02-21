import { toast } from "sonner";

// ✅ Copy Plain Text (Strips HTML)
export const copyPlainText = async (text: string) => {
    try {
        window.focus(); // Attempt to bring the window into focus
        await navigator.clipboard.writeText(text);
        toast.success("Copied to Clipboard!");
    } catch (error) {
        console.error("Copy failed:", error);
    }
};

// ✅ Copy Rich Text (Preserves HTML formatting)
export const copyRichText = async (formattedText: string) => {
    try {
        window.focus(); // Attempt to bring the window into focus
        await navigator.clipboard.writeText(formattedText);
        toast.success("Copied Formatted Text!");
    } catch (error) {
        console.error("Copy failed:", error);
    }
};
