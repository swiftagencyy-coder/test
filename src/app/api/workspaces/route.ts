import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get workspaces for the user
        let workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: (session.user as any).id,
                    },
                },
            },
        });

        // If no workspaces, create a default one for the new user
        if (workspaces.length === 0) {
            const newWorkspace = await prisma.workspace.create({
                data: {
                    name: "My First Workspace",
                    slug: `workspace-${Math.random().toString(36).substring(7)}`,
                    members: {
                        create: {
                            userId: (session.user as any).id,
                            role: "OWNER",
                        },
                    },
                },
            });
            workspaces = [newWorkspace];
        }

        return NextResponse.json(workspaces);
    } catch (error) {
        console.error("Workspace fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
