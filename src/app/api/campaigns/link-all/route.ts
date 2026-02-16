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

        const { campaignId, workspaceId } = await req.json();

        if (!campaignId || !workspaceId) {
            return NextResponse.json({ error: "Missing campaignId or workspaceId" }, { status: 400 });
        }

        const leads = await prisma.lead.findMany({
            where: { workspaceId },
        });

        const campaignLeadsData = leads.map((lead) => ({
            campaignId,
            leadId: lead.id,
            status: "ACTIVE",
        }));

        // Using createMany for efficiency if supported by the provider, 
        // but Prisma on PG supports it.
        await prisma.campaignLead.createMany({
            data: campaignLeadsData,
            skipDuplicates: true,
        });

        return NextResponse.json({ message: `Added ${leads.length} leads to campaign` });
    } catch (error) {
        console.error("Link error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
