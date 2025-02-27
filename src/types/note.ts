export type ListType = "default" | "deleted";

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    listType: ListType;
    oneClickCopy: boolean;
    createdAt: string;
    updatedAt: string;
}

export type ToggleFlag = "oneClickCopy";

export type SortedOrder = "i-updated" | "i-created" | "d-updated" | "d-created";
