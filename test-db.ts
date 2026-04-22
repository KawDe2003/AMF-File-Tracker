import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@amf.lk';
    console.log('Fetching user...');
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
