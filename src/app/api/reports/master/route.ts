import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const files = await prisma.file.findMany({
      include: {
        currentDept: true,
        currentUser: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Master Report Error:', error);
    return NextResponse.json({ error: 'Failed to generate master inventory' }, { status: 500 });
  }
}
