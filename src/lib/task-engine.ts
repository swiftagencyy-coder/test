import prisma from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";

export async function generateDailyTasks(workspaceId: string) {
    const activeCampaigns = await prisma.campaign.findMany({
        where: {
            workspaceId,
            // You might add a status field to Campaign model later
        },
        include: {
            leads: {
                where: { status: "ACTIVE" },
                include: { lead: true },
            },
            sequenceSteps: true,
        },
    });

    let tasksCreated = 0;

    for (const campaign of activeCampaigns) {
        // Basic limit: e.g., 20 new tasks per campaign per day
        const dailyLimit = 20;
        let todayCreated = 0;

        for (const campaignLead of campaign.leads) {
            if (todayCreated >= dailyLimit) break;

            const lead = campaignLead.lead;

            // Check if lead already has a pending task
            const existingTask = await prisma.task.findFirst({
                where: {
                    leadId: lead.id,
                    campaignId: campaign.id,
                    status: TaskStatus.PENDING,
                },
            });

            if (existingTask) continue;

            // Determine sequence step
            // Simple logic: find how many messages already sent
            const sentTasksCount = await prisma.task.count({
                where: {
                    leadId: lead.id,
                    campaignId: campaign.id,
                    status: TaskStatus.DONE,
                },
            });

            const nextStep = campaign.sequenceSteps.find(
                (s) => s.stepNumber === sentTasksCount + 1
            );

            if (!nextStep) continue;

            // Check delay (simplified for MVP)
            // In a real app, you'd check hours since last 'DONE' task

            // Create task
            await prisma.task.create({
                data: {
                    leadId: lead.id,
                    campaignId: campaign.id,
                    scheduledDate: new Date(),
                    draftMessage: nextStep.template, // Placeholder for personalized draft
                    type: sentTasksCount === 0 ? "OUTREACH" : "FOLLOW_UP",
                },
            });

            tasksCreated++;
            todayCreated++;
        }
    }

    return tasksCreated;
}
