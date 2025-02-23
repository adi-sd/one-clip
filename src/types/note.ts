export type ListType = "default" | "deleted";

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    listType: ListType;
    createdAt: string;
    updatedAt: string;
}
