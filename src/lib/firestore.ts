import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Note, ListType } from "@/types/note";

// 🔹 Get user notes (filtered by listType)
export const getUserNotes = async (userId: string, listType: ListType = "default"): Promise<Note[]> => {
    const notesRef = collection(db, "users", userId, "notes");
    const snapshot = await getDocs(notesRef);
    return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Note)
        .filter((note) => note.listType === listType);
};

// 🔹 Add a new note (default list)
export const addNote = async (userId: string, name: string, content: string) => {
    const noteRef = doc(collection(db, "users", userId, "notes"));
    const newNote: Note = {
        id: noteRef.id,
        userId,
        name,
        content,
        listType: "default",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await setDoc(noteRef, newNote);
};

// 🔹 Move a note to the recycle bin (update listType)
export const moveNoteToDeleted = async (userId: string, noteId: string) => {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
        listType: "deleted",
        updatedAt: serverTimestamp(),
    });
};

// 🔹 Restore a deleted note (update listType back to "default")
export const restoreNote = async (userId: string, noteId: string) => {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
        listType: "default",
        updatedAt: serverTimestamp(),
    });
};

// 🔹 Update a note's content and name
export const updateNote = async (userId: string, noteId: string, name: string, content: string) => {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
        name,
        content,
        updatedAt: serverTimestamp(),
    });
};

// 🔹 Permanently delete a note
export const deleteNotePermanently = async (userId: string, noteId: string) => {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await deleteDoc(noteRef);
};
