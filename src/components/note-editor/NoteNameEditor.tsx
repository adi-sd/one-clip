import { useState, useRef, useEffect } from "react";

const NoteNameEditor = ({ name, setName }: { name: string; setName: (name: string) => void }) => {
    const [tempName, setTempName] = useState(name);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
        if (name === "New Note") {
            setTempName("");
        }
    };

    const handleBlur = () => {
        if (!tempName.trim()) {
            setTempName(name);
        } else {
            setName(tempName);
        }
    };

    useEffect(() => {
        setTempName(name);
    }, [name]);

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

export default NoteNameEditor;
