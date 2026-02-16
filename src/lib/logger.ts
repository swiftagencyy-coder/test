import prisma from "@/lib/prisma";

export async function logAction(userId: string, action: string, details?: any) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.error("Failed to log action:", error);
    }
}
