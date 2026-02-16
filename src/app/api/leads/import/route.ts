import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { leads, workspaceId } = await req.json();

        if (!leads || !Array.isArray(leads) || !workspaceId) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const leadData of leads) {
            const { handle, name, niche, city, bio } = leadData;

            if (!handle) {
                skippedCount++;
                continue;
            }

            // Format handle to ensure it starts with @
            const formattedHandle = handle.startsWith("@") ? handle : `@${handle}`;

            try {
                await prisma.lead.upsert({
                    where: {
                        handle_workspaceId: {
                            handle: formattedHandle,
                            workspaceId,
                        },
                    },
                    update: {
                        name: name || undefined,
                        niche: niche || undefined,
                        city: city || undefined,
                        bio: bio || undefined,
                    },
                    create: {
                        handle: formattedHandle,
                        name,
                        niche,
                        city,
                        bio,
                        workspaceId,
                    },
                });
                createdCount++;
            } catch (err) {
                console.error(`Failed to import lead ${handle}:`, err);
                skippedCount++;
            }
        }

        return NextResponse.json({
            message: "Import completed",
            createdCount,
            skippedCount,
        });
    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
