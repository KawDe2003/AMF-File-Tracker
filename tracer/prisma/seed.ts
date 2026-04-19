import { PrismaClient, Role, FileType, Priority, FileStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Departments
  const finance = await prisma.department.upsert({
    where: { name: 'Finance Dept' },
    update: {},
    create: { name: 'Finance Dept' },
  });

  const legal = await prisma.department.upsert({
    where: { name: 'Legal Dept' },
    update: {},
    create: { name: 'Legal Dept' },
  });

  const headOffice = await prisma.department.upsert({
    where: { name: 'Head Office' },
    update: {},
    create: { name: 'Head Office' },
  });

  const branch = await prisma.department.upsert({
    where: { name: 'City Branch' },
    update: {},
    create: { name: 'City Branch' },
  });

  // 2. Create a Mock Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tracer.com' },
    update: {},
    create: {
      email: 'admin@tracer.com',
      name: 'System Administrator',
      passwordHash: 'hashed_password', // Mocked hash
      role: Role.ADMIN,
      departmentId: headOffice.id,
      nic: '123456789V'
    },
  });

  // 3. Create a Staff User at Branch
  const staff = await prisma.user.upsert({
    where: { email: 'staff@tracer.com' },
    update: {},
    create: {
      email: 'staff@tracer.com',
      name: 'Kasun Perera',
      passwordHash: 'hashed_password',
      role: Role.STAFF,
      departmentId: branch.id,
      nic: '987654321V'
    },
  });

  // 4. Create some initial files
  await prisma.file.createMany({
    data: [
      {
        title: 'Mazda Axela CR - CAB-2940',
        fileType: FileType.CR,
        nic: '112233445V',
        vehicleNo: 'CAB-2940',
        priority: Priority.HIGH,
        status: FileStatus.AT_BRANCH,
        currentDeptId: branch.id,
        currentUserId: staff.id
      },
      {
        title: 'Toyota Aqua CR - WP-KQ-8821',
        fileType: FileType.CR,
        nic: '998877665V',
        vehicleNo: 'WP-KQ-8821',
        priority: Priority.MEDIUM,
        status: FileStatus.IN_TRANSIT,
        currentDeptId: branch.id,
        currentUserId: staff.id
      }
    ],
  });

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
