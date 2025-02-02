"use client";

import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { Note } from "@/types/note";

const NoteCard = ({
    note,
    onEdit,
    onDelete,
}: {
    note: Note;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(note.content).then(() => {
            console.log("Copied to clipboard: ", note.content);
        });
    };

    return (
        <Card
            className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 relative overflow-hidden cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-105 
            h-[120px] w-full sm:h-[140px] sm:w-full md:h-[160px] md:w-full lg:h-[180px] lg:w-full xl:h-[200px] xl:w-full 
            flex flex-col justify-between"
            onClick={handleCopyToClipboard}
        >
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(note.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaPenClip size={16} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTrash size={16} />
                </button>
            </div>

            {/* Note Content */}
            <p className="text-lg font-medium mt-8 overflow-hidden text-ellipsis break-words line-clamp-3">
                {note.content}
            </p>
        </Card>
    );
};

export default NoteCard;
