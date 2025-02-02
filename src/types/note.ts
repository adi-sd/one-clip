export type ListType = "default" | "deleted";

export interface Note {
    id: string;
    userId: string;
    name: string;
    content: string;
    listType: ListType;
    createdAt: number;
    updatedAt: number;
}
