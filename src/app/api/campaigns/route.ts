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

        const campaigns = await prisma.campaign.findMany({
            where: { workspaceId },
            include: {
                _count: {
                    select: { leads: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("Campaign fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, goal, messagingRules, workspaceId, steps } = await req.json();

        if (!name || !workspaceId) {
            return NextResponse.json({ error: "Name and Workspace ID required" }, { status: 400 });
        }

        const campaign = await prisma.campaign.create({
            data: {
                name,
                goal,
                messagingRules,
                workspaceId,
                sequenceSteps: {
                    create: steps.map((step: any, index: number) => ({
                        stepNumber: index + 1,
                        delayDays: step.delayDays || 0,
                        template: step.template,
                    })),
                },
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Campaign create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
