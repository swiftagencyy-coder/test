import { NextRequest, NextResponse } from "next/server";
import { generateDailyTasks } from "@/lib/task-engine";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { workspaceId } = await req.json();

        if (!workspaceId) {
            return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
        }

        const count = await generateDailyTasks(workspaceId);

        return NextResponse.json({
            message: "Task generation completed",
            count,
        });
    } catch (error) {
        console.error("Task generation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
