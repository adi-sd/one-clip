// app/api/notes/[id]/[flagName]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ObjectId } from "mongodb";
import { ToggleFlag } from "@/types/note";

type Params = Promise<{
    id: string;
    flagName: ToggleFlag;
}>;

export async function PUT(req: NextRequest, { params }: { params: Params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, flagName } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
        }

        // Since ToggleFlag is defined as "oneClickCopy", we check.
        if (flagName !== "oneClickCopy") {
            return NextResponse.json({ error: "Invalid flag name" }, { status: 400 });
        }

        // Parse the request body expecting { value: boolean }
        const body = await req.json();
        const { value } = body;
        if (typeof value !== "boolean") {
            return NextResponse.json({ error: "Invalid flag value" }, { status: 400 });
        }

        // Fetch the note ensuring it belongs to the authenticated user.
        const note = await prisma.note.findFirst({
            where: { id, userId: session.user.id },
        });
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        // Update the note with the new flag value.
        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                oneClickCopy: value,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        console.error("Error updating note flag:", error);
        return NextResponse.json(
            { error: "Failed to update note flag", message: (error as Error).message },
            { status: 500 }
        );
    }
}
