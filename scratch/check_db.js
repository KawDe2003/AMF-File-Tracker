const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.file.count();
  const deptCount = await prisma.department.count();
  const files = await prisma.file.findMany({ take: 5 });
  console.log('Total Files:', count);
  console.log('Total Departments:', deptCount);
  console.log('Sample Files:', JSON.stringify(files, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
