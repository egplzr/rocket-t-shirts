import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.upsert({
        where: {username: 'admin'},
        update: {},
        create: {
            username: 'admin',
            password: await bcrypt.hash('123456', 10)
        }
    });
}

main()
.then(() => prisma.$disconnect())
.catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});