import { ReactNode } from "react";
import { Note } from "@/types/note";
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericUp, FaSortNumericDown } from "react-icons/fa";

export type SortByKeys =
    | "name-a-to-z"
    | "name-z-to-a"
    | "created-at-new-old"
    | "created-at-old-new"
    | "updated-at-new-old"
    | "updated-at-old-new";

export type SortByType = {
    key: SortByKeys;
    prop: "title" | "createdAt" | "updatedAt";
    type: "alpha" | "numeric" | "date";
    order: "up" | "down";
    icon: ReactNode;
    compareFunction: (a: Note, b: Note) => number;
    text: string;
};

export const SortByTypesArray: SortByType[] = [
    {
        key: "name-a-to-z",
        prop: "title",
        type: "alpha",
        order: "down",
        icon: <FaSortAlphaDown size={14} />,
        compareFunction: (a: Note, b: Note) => a.title.localeCompare(b.title),
        text: "Name: A to Z",
    },
    {
        key: "name-z-to-a",
        prop: "title",
        type: "alpha",
        order: "up",
        icon: <FaSortAlphaUp size={14} />,
        compareFunction: (a: Note, b: Note) => b.title.localeCompare(a.title),
        text: "Name: Z to A",
    },
    {
        key: "created-at-new-old",
        prop: "createdAt",
        type: "date",
        order: "down",
        icon: <FaSortNumericDown size={14} />,
        compareFunction: (a: Note, b: Note) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        text: "Created (Newest First)",
    },
    {
        key: "created-at-old-new",
        prop: "createdAt",
        type: "date",
        order: "up",
        icon: <FaSortNumericUp size={14} />,
        compareFunction: (a: Note, b: Note) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        text: "Created (Oldest First)",
    },
    {
        key: "updated-at-new-old",
        prop: "updatedAt",
        type: "date",
        order: "down",
        icon: <FaSortNumericDown size={14} />,
        compareFunction: (a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        text: "Updated (Newest First)",
    },
    {
        key: "updated-at-old-new",
        prop: "updatedAt",
        type: "date",
        order: "up",
        icon: <FaSortNumericUp size={14} />,
        compareFunction: (a: Note, b: Note) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        text: "Updated (Oldest First)",
    },
];
