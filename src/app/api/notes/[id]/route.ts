import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // ✅ Use a shared Prisma client

type Params = Promise<{
    id: string;
}>;

// ✅ Utility function for error handling
const handleError = (error: unknown, context: string) => {
    console.error(`❌ Error in ${context}:`, error);
    return NextResponse.json({ error: `Failed to ${context}`, message: (error as Error).message }, { status: 500 });
};

// ✅ Get a single note (GET /api/notes/:id)
export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const note = await prisma.note.findUnique({
            where: { id: id, userId: session.user.id },
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        return NextResponse.json(note, { status: 200 });
    } catch (error) {
        return handleError(error, "fetch note");
    }
}

// ✅ Update a note (PUT /api/notes/:id)
export async function PUT(req: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, content, listType } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const { id } = await params;
        const existingNote = await prisma.note.findUnique({
            where: { id: id, userId: session.user.id },
        });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        const updatedNote = await prisma.note.update({
            where: { id: id },
            data: {
                name,
                content: content ?? existingNote.content,
                listType: listType ?? existingNote.listType,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        return handleError(error, "update note");
    }
}

// ✅ Delete a note (DELETE /api/notes/:id)
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const existingNote = await prisma.note.findUnique({
            where: { id: id, userId: session.user.id },
        });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        await prisma.note.delete({ where: { id: id } });

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        return handleError(error, "delete note");
    }
}
