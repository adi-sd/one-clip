import { useScreenResize } from "@/hooks/useScreenResize";
import { useNotesStore } from "@/store/noteStore";
import { ListType, Note } from "@/types/note";
import { FaPlus } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function CreateNewNoteButton() {
    const { user, setIsDialogOpen } = useNotesStore();
    const { isLargeScreen } = useScreenResize();

    // Handler: create a new empty note.
    const handleCreateNewEmptyNote = () => {
        if (!user) {
            return;
        }
        const newNote = {
            title: "New Note",
            content: "",
            listType: "default" as ListType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id, // Include the user id
            oneClickCopy: true, // Default value
        };
        // Update the store: add new note at the beginning and set it as the current note.
        useNotesStore.setState(() => ({
            // notes: [newNote, ...state.notes],
            currentNote: newNote as Note,
        }));
        if (!isLargeScreen) {
            setIsDialogOpen(true);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={handleCreateNewEmptyNote}
                    className="h-full w-fit bg-green-500 p-3 md:px-3 md:py-0 rounded-full ml-auto hover:bg-green-600"
                >
                    <div className="flex items-center justify-center gap-x-2 text-white">
                        {isLargeScreen ? <FaPlus size={18} /> : <FaPlus size={20} />}
                        {isLargeScreen ? (
                            <span className="h-full text-sm font-semibold text-nowrap">New Note</span>
                        ) : null}
                    </div>
                </button>
            </TooltipTrigger>
            <TooltipContent align="center">
                <p>Create A New Note</p>
            </TooltipContent>
        </Tooltip>
    );
}
