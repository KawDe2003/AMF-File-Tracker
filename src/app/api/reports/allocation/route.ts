import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const agents = await prisma.user.findMany({
      where: { isCallingAgent: true },
      include: {
        _count: {
          select: { currentFiles: true }
        }
      }
    });

    const report = agents.map(agent => ({
      agentName: agent.name,
      agentEmail: agent.email,
      assignedFiles: agent._count.currentFiles,
    }));

    return NextResponse.json(report);
  } catch (error) {
    console.error('Allocation Report Error:', error);
    return NextResponse.json({ error: 'Failed to generate allocation breakdown' }, { status: 500 });
  }
}
