import { useScreenResize } from "@/hooks/useScreenResize";
import { FaSort } from "react-icons/fa";

export default function SortNotesTrigger() {
    const { isLargeScreen } = useScreenResize();
    return (
        <div className="rounded-full flex gap-x-2 m-0 p-1 md:px-1 md:py-1">
            {isLargeScreen ? <FaSort size={18} /> : <FaSort size={20} />}
            {isLargeScreen ? <span className="h-full text-sm font-semibold text-nowrap">Sort Notes</span> : null}
        </div>
    );
}
