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

        const templates = await prisma.template.findMany({
            where: { workspaceId },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(templates);
    } catch (error) {
        console.error("Templates fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, content, workspaceId } = await req.json();

        if (!name || !content || !workspaceId) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const template = await prisma.template.create({
            data: { name, content, workspaceId },
        });

        return NextResponse.json(template);
    } catch (error) {
        console.error("Template create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
