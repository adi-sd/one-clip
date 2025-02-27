import { useScreenResize } from "@/hooks/useScreenResize";
import { useNotesStore } from "@/store/noteStore";
import { ListType, Note } from "@/types/note";
import { FaPlus } from "react-icons/fa";

export default function CreateNewNoteButton() {
    const { user } = useNotesStore();
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
            disableOneClickCopy: false, // Default value
        };
        // Update the store: add new note at the beginning and set it as the current note.
        useNotesStore.setState(() => ({
            // notes: [newNote, ...state.notes],
            currentNote: newNote as Note,
        }));
    };

    return (
        <button
            onClick={handleCreateNewEmptyNote}
            className="h-full w-fit bg-green-500 p-3 md:px-3 md:py-0 rounded-full ml-auto"
        >
            <div className="flex items-center justify-center gap-x-2 text-white">
                {isLargeScreen ? <FaPlus size={18} /> : <FaPlus size={20} />}
                {isLargeScreen ? <span className="h-full text-sm font-semibold text-nowrap">New Note</span> : null}
            </div>
        </button>
    );
}
