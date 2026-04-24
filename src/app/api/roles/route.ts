import { NextResponse } from 'next/server'; 
import prisma from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    const existing = await prisma.role.findUnique({
      where: { name: name.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Role already exists' }, { status: 409 });
    }

    const role = await prisma.role.create({
      data: {
        name: name.toUpperCase(),
        description,
      },
    });

    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'ROLE_CREATE', `Created role: ${role.name}`);

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.error('Role Create Error:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}
