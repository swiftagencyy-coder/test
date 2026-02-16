import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

        const [totalLeads, totalTasks, replies, qualified] = await Promise.all([
            prisma.lead.count({ where: { workspaceId } }),
            prisma.task.count({ where: { lead: { workspaceId } } }),
            prisma.task.count({ where: { lead: { workspaceId }, outcome: "REPLIED" } }),
            prisma.lead.count({ where: { workspaceId, stage: "QUALIFIED" } }),
        ]);

        return NextResponse.json({
            totalLeads,
            messagesDrafted: totalTasks,
            repliesLogged: replies,
            qualifiedLeads: qualified,
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
