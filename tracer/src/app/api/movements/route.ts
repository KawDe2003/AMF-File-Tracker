import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let whereClause = {};
    if (status && status !== 'ALL') {
      whereClause = { status };
    }

    const movements = await prisma.fileMovement.findMany({
      where: whereClause,
      include: {
        file: true,
        sender: true,
        receiver: true,
        fromDept: true,
        toDept: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error('Failed to fetch movements:', error);
    return NextResponse.json({ error: 'Failed to fetch movements' }, { status: 500 });
  }
}
