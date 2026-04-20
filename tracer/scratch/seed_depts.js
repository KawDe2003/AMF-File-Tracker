const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial departments...');
  
  const depts = [
    { name: 'Central Vault', id: 'VAULT-001' },
    { name: 'Credit Dept', id: 'CREDIT-001' },
    { name: 'Legal Dept', id: 'LEGAL-001' },
    { name: 'Branch Ops', id: 'BRANCH-001' }
  ];

  for (const dept of depts) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: {},
      create: dept,
    });
  }

  console.log('Seed completed successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
