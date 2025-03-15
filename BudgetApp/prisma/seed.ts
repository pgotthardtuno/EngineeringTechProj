import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.expense.createMany({
        data: [
            {
                description: "Weekly trip to the store",
                date: new Date(),
                cost: 100,
                category: "Food"
            },
            {
                description: "Dinner and a movie",
                date: new Date(),
                cost: 50,
                category: "Entertainment"
            },
            {
                description: "Electric bill",
                date: new Date(),
                cost: 150,
                category: "Bills"
            },
            {
                description: "Gasoline",
                date: new Date(),
                cost: 75,
                category: "Transportation"
            },
            {
                description: "Random purchase",
                date: new Date(),
                cost: 25,
                category: "Other"
            }
        ]
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });