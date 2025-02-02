import { Note } from "@/types/note";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const DisplayContainer = ({
    selectedNote,
    onEdit,
    onDelete,
}: {
    selectedNote: Note | null;
    onEdit: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
}) => {
    const [content, setContent] = useState("");

    // ✅ Instantly update the editor when switching notes
    useEffect(() => {
        setContent(selectedNote?.content || "");
    }, [selectedNote]);

    if (!selectedNote) {
        return <p className="text-gray-500">Select a note to view or edit.</p>;
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg h-full flex flex-col">
            <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold mb-3">{selectedNote.name}</h2>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(selectedNote.id);
                    }}
                    className="text-gray-500 hover:text-gray-700 h-[28px] w-[28px] flex items-center justify-center"
                >
                    <FaTrash size={20} />
                </button>
            </div>
            <textarea
                className="w-full h-[300px] border-none shadow-inner border-gray-300 p-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-end"
                onClick={() => onEdit({ ...selectedNote, content })}
            >
                Save
            </button>
        </div>
    );
};

export default DisplayContainer;
