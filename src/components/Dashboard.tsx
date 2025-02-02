"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sampleNotes from "@/data/sampleNotes";
import NotesContainer from "@/components/NotesContainer";
import { Note } from "@/types/note";

const Dashboard = () => {
    const { status } = useSession();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/"); // Redirect if unauthenticated
        } else if (status === "authenticated") {
            setNotes(sampleNotes); // Load sample notes for now
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // Placeholder functions
    const handleEditNote = (id: string) => {
        console.log("Edit note:", id);
    };

    const handleDeleteNote = (id: string) => {
        console.log("Delete note:", id);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <NotesContainer notes={notes} onEdit={handleEditNote} onDelete={handleDeleteNote} />
        </div>
    );
};

export default Dashboard;
