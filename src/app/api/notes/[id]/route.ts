import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // ✅ Use a shared Prisma client

// ✅ Utility function for error handling
const handleError = (error: unknown, context: string) => {
    console.error(`❌ Error in ${context}:`, error);
    return NextResponse.json({ error: `Failed to ${context}`, message: (error as Error).message }, { status: 500 });
};

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
