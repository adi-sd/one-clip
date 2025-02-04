import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // ✅ Use a shared Prisma client

// ✅ Utility function for error handling
const handleError = (error: unknown, context: string) => {
    console.error(`❌ Error in ${context}:`, error);
    return NextResponse.json({ error: `Failed to ${context}`, message: (error as Error).message }, { status: 500 });
};

// ✅ Fetch Notes (GET)
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

// ✅ Create a Note (POST)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, content, listType = "default" } = body;

        const note = await prisma.note.create({
            data: {
                userId: session.user.id,
                name: name ?? "New Note",
                content: content ?? "",
                listType,
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        return handleError(error, "create note");
    }
}

// ✅ Update a Note (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = params.id; // ✅ Extract ID from the URL
        console.log(id);
        const body = await req.json();
        const { name, content, listType } = body;

        if (!id || !name?.trim()) {
            // ✅ Allow empty content
            return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
        }

        const existingNote = await prisma.note.findUnique({ where: { id } });

        if (!existingNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        if (existingNote.userId !== session.user.id) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                name,
                content: content ?? existingNote.content, // ✅ Keep existing content if not provided
                listType: listType ?? existingNote.listType,
                updatedAt: new Date().toISOString(),
            },
        });

        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        return handleError(error, "update note");
    }
}

// ✅ Delete a Note (DELETE)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
        }

        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        if (note.userId !== session.user.id) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        await prisma.note.delete({ where: { id } });

        return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
    } catch (error) {
        return handleError(error, "delete note");
    }
}
