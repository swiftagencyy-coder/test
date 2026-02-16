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

        const leads = await prisma.lead.findMany({
            where: {
                workspaceId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Leads fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { handle, name, niche, city, bio, workspaceId } = body;

        if (!handle || !workspaceId) {
            return NextResponse.json({ error: "Handle and Workspace ID required" }, { status: 400 });
        }

        const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;

        const lead = await prisma.lead.create({
            data: {
                handle: formattedHandle,
                name,
                niche,
                city,
                bio,
                workspaceId,
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Lead create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
