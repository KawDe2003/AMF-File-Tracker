import { PrismaClient, Role, FileType, Priority, FileStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  // 2. Create Admin User with a real hashed password
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amf.lk' },
    update: { passwordHash: adminHash },
    create: {
      email: 'admin@amf.lk',
      name: 'System Administrator',
      passwordHash: adminHash,
      role: Role.ADMIN,
      departmentId: headOffice.id,
      nic: '123456789V',
      isCallingAgent: false,
    },
  });

  // 3. Create a Calling Agent Staff User
  const agentHash = await bcrypt.hash('Agent@123', 12);
  const agent1 = await prisma.user.upsert({
    where: { email: 'agent1@amf.lk' },
    update: { passwordHash: agentHash },
    create: {
      email: 'agent1@amf.lk',
      name: 'Kasun Perera',
      passwordHash: agentHash,
      role: Role.STAFF,
      departmentId: branch.id,
      nic: '987654321V',
      isCallingAgent: true,
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: 'agent2@amf.lk' },
    update: { passwordHash: agentHash },
    create: {
      email: 'agent2@amf.lk',
      name: 'Nimal Bandara',
      passwordHash: agentHash,
      role: Role.STAFF,
      departmentId: branch.id,
      nic: '876543210V',
      isCallingAgent: true,
    },
  });

  // 4. Create a Manager
  const managerHash = await bcrypt.hash('Manager@123', 12);
  await prisma.user.upsert({
    where: { email: 'manager@amf.lk' },
    update: { passwordHash: managerHash },
    create: {
      email: 'manager@amf.lk',
      name: 'Dilrukshi Silva',
      passwordHash: managerHash,
      role: Role.MANAGER,
      departmentId: finance.id,
      isCallingAgent: false,
    },
  });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Login Credentials:');
  console.log('  Admin:   admin@amf.lk    / Admin@123');
  console.log('  Agent 1: agent1@amf.lk   / Agent@123');
  console.log('  Agent 2: agent2@amf.lk   / Agent@123');
  console.log('  Manager: manager@amf.lk  / Manager@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
