import { Card } from "@/components/ui/card";
import { FaPenClip, FaTrash } from "react-icons/fa6";
import { Note } from "@/types/note";

const NoteCard = ({
    note,
    onEdit,
    onDelete,
    showEditButton,
}: {
    note: Note;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    showEditButton: boolean;
}) => {
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(note.content).then(() => {
            console.log("Copied to clipboard: ", note.content);
        });

        // Only open editor in large screens
        if (!showEditButton) {
            onEdit(note.id);
        }
    };

    return (
        <Card
            className="bg-white shadow-md hover:shadow-xl rounded-lg p-4 relative overflow-hidden cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-105 
            h-[120px] w-full sm:h-[140px] sm:w-full md:h-[160px] md:w-full lg:h-[180px] lg:w-full xl:h-[200px] xl:w-full 
            flex flex-col"
            onClick={handleCopyToClipboard}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="font-semibold overflow-hidden text-nowrap text-ellipsis mr-2 text-normal md:text-lg">
                    {note.name}
                </span>
                <div className="flex gap-x-3">
                    {/* Show edit button only when DisplayContainer is hidden */}
                    {showEditButton && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(note.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 h-[20px] w-[20px] flex items-center justify-center"
                        >
                            <FaPenClip size={16} />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note.id);
                        }}
                        className="text-gray-500 hover:text-gray-700 h-[20px] w-[20px] flex items-center justify-center"
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
            </div>

            {/* Note Content */}
            <p className="flex-1 text-normal md:text-lg font-medium mt-4 overflow-hidden text-ellipsis break-words line-clamp-3">
                {note.content}
            </p>
        </Card>
    );
};

export default NoteCard;
