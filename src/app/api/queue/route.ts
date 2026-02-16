import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
        }

        const tasks = await prisma.task.findMany({
            where: {
                status: TaskStatus.PENDING,
                lead: { workspaceId },
            },
            include: {
                lead: true,
                // campaign: true, // You might need this for the UI
            },
            orderBy: {
                scheduledDate: "asc",
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Queue fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
