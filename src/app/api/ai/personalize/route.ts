import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bio, recentPost, tone, handle } = await req.json();

        if (!bio || !tone) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // In a real app, this would call OpenAI
        // For this build, I'll provide a high-quality simulated response 
        // to demonstrate the logic without requiring an API key immediately.

        const prompt = `Generate a personalized Instagram DM for ${handle}. 
    Bio: ${bio}
    Recent Post: ${recentPost}
    Tone: ${tone}`;

        // Mocking OpenAI response
        const draft = `Hey ${handle}! Just saw your recent post about ${recentPost?.substring(0, 30)}... and was really impressed. Loved your bio too - "${bio.substring(0, 30)}...". Would love to connect!`;

        return NextResponse.json({ draft });
    } catch (error) {
        console.error("AI Personalization error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
