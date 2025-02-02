export type ListType = "default" | "deleted";

export interface Note {
    id: string;
    userId: string;
    content: string;
    listType: ListType;
    createdAt: number;
    updatedAt: number;
}
