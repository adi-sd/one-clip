import { Card } from "@/components/ui/card";
import SearchBar from "@/components/action-container/SearchBar";
import CreateNewNoteButton from "@/components/action-container/CreateNewNoteButton";
import SortNotesButton from "@/components/action-container/SortNotesButton";
import SelectNotesButton from "@/components/action-container/SelectNotesButton";
// import NoteTypeFilter from "@/components/action-container/NoteTypeFilter";

export default function ActionContainer() {
    return (
        <Card className="w-full h-[80px] rounded-lg shadow-sm md:shadow-md bg-white px-2 md:px-4 py-4 flex gap-x-2 md:gap-x-4 text-sm md:text-lg border-gray-300">
            {/* Search Bar */}
            <SearchBar />

            {/* Filter By Note Type - Desktop*/}
            {/* <NoteTypeFilter /> */}

            {/* Sort By NOte*/}
            <SortNotesButton defaultSortKey="created-at-new-old" />

            {/* Select Note Button */}
            <SelectNotesButton />

            {/* Create Note Button */}
            <CreateNewNoteButton />
        </Card>
    );
}
