import { useRef } from "react";

const NoteTitleEditor = ({ title, setTitle }: { title: string; setTitle: (title: string) => void }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Handle focus behavior
    const handleFocus = () => {
        if (title === "New Note") {
            setTitle(""); // Clear input if it's "New Note"
            setTimeout(() => {
                inputRef.current?.setSelectionRange(0, 0); // Start typing from the beginning
            }, 0);
        } else {
            setTimeout(() => {
                const length = title.length;
                inputRef.current?.setSelectionRange(length, length); // Move cursor to end
            }, 0);
        }
    };

    // Handle blur (when clicking outside)
    const handleBlur = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") {
            setTitle("New Note"); // Reset if empty
        } else {
            setTitle(trimmedTitle); // Trim and save
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="h-full w-full text-xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none focus:bg-transparent"
        />
    );
};

export default NoteTitleEditor;
