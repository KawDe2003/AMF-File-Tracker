import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { recordAuditLog } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const callingAgentsOnly = searchParams.get('callingAgents') === 'true';

    const users = await prisma.user.findMany({
      where: callingAgentsOnly ? { isCallingAgent: true } : undefined,
      include: { department: true },
      orderBy: { name: 'asc' },
    });

    // Never return password hashes
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, departmentId, nic, isCallingAgent } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'STAFF',
        departmentId: departmentId || null,
        nic: nic || null,
        isCallingAgent: isCallingAgent || false,
      },
      include: { department: true },
    });

    const { passwordHash: _, ...safeUser } = user;
    
    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'USER_CREATE', `Created user: ${name} (${email}) with role ${role}`);

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error('User Create Error:', error);
    return NextResponse.json({
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isCallingAgent } = body;

    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id },
      data: { isCallingAgent },
    });

    const { passwordHash: _, ...safeUser } = updated;

    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'USER_PATCH', `Updated user ${id}: isCallingAgent=${isCallingAgent}`);

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const user = await prisma.user.delete({
      where: { id },
    });

    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'USER_DELETE', `Deleted user: ${user.name} (${user.email})`);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('User Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

