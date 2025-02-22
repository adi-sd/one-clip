import { useState, useRef } from "react";

const TitleEditor = ({ title, setTitle }: { title: string; setTitle: (title: string) => void }) => {
    const [tempTitle, setTempTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
        if (title === "New Note") {
            setTempTitle("");
        }
    };

    const handleBlur = () => {
        if (!tempTitle.trim()) {
            setTempTitle(title);
        } else {
            setTitle(tempTitle);
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onFocus={handleFocus} // ✅ Clears only when "New Note"
            onBlur={handleBlur} // ✅ Reverts if empty
            className="h-full w-full text-xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none focus:bg-transparent"
        />
    );
};

export default TitleEditor;
