import { useScreenResize } from "@/hooks/useScreenResize";
import { useNotesStore } from "@/store/noteStore";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function SelectNotesTrigger() {
    const { selectedNotes } = useNotesStore();
    const { isLargeScreen } = useScreenResize();
    return (
        <div className="rounded-full flex gap-x-2 m-0 p-1 md:px-1 md:py-1">
            {isLargeScreen ? <IoCheckmarkDoneSharp size={18} /> : <IoCheckmarkDoneSharp size={20} />}
            {isLargeScreen ? (
                <span className="h-full text-sm font-semibold text-nowrap">{`Selected (${selectedNotes.size})`}</span>
            ) : (
                <span className="h-full text-sm font-semibold text-nowrap">{`(${selectedNotes.size})`}</span>
            )}
        </div>
    );
}
