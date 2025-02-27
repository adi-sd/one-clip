import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Utility function for error handling
const handleError = (error: unknown, context: string) => {
    console.error(`❌ Error in ${context}:`, error);
    return NextResponse.json({ error: `Failed to ${context}`, message: (error as Error).message }, { status: 500 });
};

// Get all notes (GET /api/notes)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notes = await prisma.note.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        return handleError(error, "fetch notes");
    }
}

// Create a new note (POST /api/notes)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, listType = "default" } = body;

        const note = await prisma.note.create({
            data: {
                userId: session.user.id,
                title: title?.trim() || "New Note",
                content: content || "",
                listType,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return handleError(error, "create note");
    }
}
