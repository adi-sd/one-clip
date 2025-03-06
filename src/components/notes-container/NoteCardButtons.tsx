import { useScreenResize } from "@/hooks/useScreenResize";
import { FaPenClip, FaTrash, FaCheck } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { NoteCardActionType } from "@/components/notes-container/NoteCard";

interface NoteCardButtonsProps {
    isNoteSelected: boolean;
    handleButtonClick: (
        event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        action: NoteCardActionType
    ) => void;
}

export default function NoteCardButtons({ isNoteSelected, handleButtonClick }: NoteCardButtonsProps) {
    const { isLargeScreen } = useScreenResize();

    return (
        <div className="flex items-center gap-x-2">
            {!isLargeScreen && (
                <>
                    <button
                        onClick={(e) => handleButtonClick(e, "edit")}
                        className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                    >
                        <FaPenClip size={12} />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, "options")}
                        className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
                    >
                        <TiThMenu size={12} />
                    </button>
                </>
            )}
            <button
                className={`text-gray-400 p-1 rounded-sm  ${isNoteSelected ? "text-white bg-green-500" : "hover:text-white hover:bg-green-500"}`}
                onClick={(e) => handleButtonClick(e, "select")}
            >
                <FaCheck size={14} />
            </button>
            <button
                onClick={(e) => handleButtonClick(e, "delete")}
                className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-300 rounded-sm"
            >
                <FaTrash size={12} />
            </button>
        </div>
    );
}
