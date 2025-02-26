import { toast } from "sonner";
import sanitizeHtml from "sanitize-html";

// Sanitize HTML Text for NOte Content
export const sanitizeNoteContent = (noteContent: string) => {
    return sanitizeHtml(noteContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "span",
            "ul",
            "li",
            "label",
            "input",
            "div",
            "p",
        ]),
        allowedAttributes: {
            img: ["src", "alt", "title", "width", "height"],
            span: ["style"],
            input: ["type", "checked"], // ✅ Allows checkboxes
            li: ["data-type", "data-checked"], // ✅ Allows task items
            ul: ["data-type"], // ✅ Allows task list
            label: [], // ✅ Allows labels for checkboxes
            div: [],
            p: [],
        },
        allowedSchemes: ["http", "https"],
    });
};

// ✅ Copy Plain Text (Strips HTML)
export const copyPlainText = async (text: string) => {
    try {
        window.focus(); // Attempt to bring the window into focus
        await navigator.clipboard.writeText(sanitizeHtml(text));
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
