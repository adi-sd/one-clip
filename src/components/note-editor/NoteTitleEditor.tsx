import { useState, useRef, useEffect } from "react";

const NoteTitleEditor = ({ title, setTitle }: { title: string; setTitle: (title: string) => void }) => {
    const [tempName, setTempName] = useState(title);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
        if (title === "New Note") {
            setTempName("");
        }
    };

    const handleBlur = () => {
        if (!tempName.trim()) {
            setTempName(title);
        } else {
            setTitle(tempName);
        }
    };

    useEffect(() => {
        setTempName(title);
    }, [title]);

    return (
        <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onFocus={handleFocus} // ✅ Clears only when "New Note"
            onBlur={handleBlur} // ✅ Reverts if empty
            className="h-full w-full text-xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none focus:bg-transparent"
        />
    );
};

export default NoteTitleEditor;
