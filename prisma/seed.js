const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const workspace = await prisma.workspace.upsert({
        where: { slug: "demo-workspace" },
        update: {},
        create: {
            name: "Demo Workspace",
            slug: "demo-workspace",
            leads: {
                create: [
                    {
                        handle: "@fitness_pro",
                        name: "Alex Fitness",
                        niche: "Fitness",
                        stage: "NEW",
                    },
                    {
                        handle: "@tech_guru",
                        name: "Sam Tech",
                        niche: "Technology",
                        stage: "CONTACTED",
                    },
                ],
            },
        },
    });

    console.log("Seeded database with demo workspace and leads:", workspace.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
