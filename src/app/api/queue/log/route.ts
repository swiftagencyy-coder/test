import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TaskStatus, Outcome, LeadStage } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { taskId, outcome } = await req.json();

        if (!taskId || !outcome) {
            return NextResponse.json({ error: "Task ID and outcome required" }, { status: 400 });
        }

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: outcome === "SKIPPED" ? TaskStatus.SKIPPED : TaskStatus.DONE,
                outcome: outcome !== "SKIPPED" ? outcome : undefined,
            },
            include: {
                lead: true,
            },
        });

        // Update lead stage if successfully sent or replied
        if (outcome === Outcome.SENT) {
            await prisma.lead.update({
                where: { id: task.leadId },
                data: { stage: LeadStage.CONTACTED },
            });
        } else if (outcome === Outcome.REPLIED) {
            await prisma.lead.update({
                where: { id: task.leadId },
                data: { stage: LeadStage.REPLIED },
            });
        }

        return NextResponse.json(task);
    } catch (error) {
        console.error("Task update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
