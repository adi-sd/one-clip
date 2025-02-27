import { ReactNode } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoMdDoneAll } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";

export default function NoteTypeFilter() {
    const NoteTypes: {
        name: string;
        value: string;
        icon: ReactNode;
    }[] = [
        {
            name: "Note Types",
            value: "placeholder",
            icon: <FaFilter className="text-gray-500"></FaFilter>,
        },
        {
            name: "All Notes",
            value: "all",
            icon: <IoMdDoneAll className="text-gray-500"></IoMdDoneAll>,
        },
        {
            name: "Deleted",
            value: "deleted",
            icon: <IoTrashBinOutline className="text-gray-500"></IoTrashBinOutline>,
        },
    ];
    return (
        <Select>
            <SelectTrigger className="h-full w-[150px] flex rounded-full focus:ring-2 focus-visible:ring-2 focus-within:ring-2 focus:ring-gray-400 focus-visible:ring-gray-400  focus-within:ring-gray-400 border-l-0">
                <SelectValue
                    placeholder={
                        <div className="p-2 flex items-center gap-x-3">
                            <FaFilter className="text-gray-500" />
                            <span>Note Type</span>
                        </div>
                    }
                />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {NoteTypes.filter((noteType) => noteType.value !== "placeholder").map((noteType) => (
                        <SelectItem key={noteType.value} value={noteType.value}>
                            <div className="p-2 flex items-center gap-x-3">
                                {noteType.icon}
                                <span>{noteType.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
