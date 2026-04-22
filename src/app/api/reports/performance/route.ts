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
        currentFiles: true
      }
    });

    const report = agents.map(agent => {
      const totalAssigned = agent.currentFiles.length;
      const verified = agent.currentFiles.filter(f => f.customerStatus === 'VERIFIED').length;
      const inProgress = agent.currentFiles.filter(f => f.customerStatus === 'CONTACTED').length;
      const pending = totalAssigned - verified - inProgress;

      return {
        agentName: agent.name,
        agentEmail: agent.email,
        totalAssigned,
        verified,
        inProgress,
        pending,
        successRate: totalAssigned > 0 ? ((verified / totalAssigned) * 100).toFixed(2) + '%' : '0%'
      };
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Performance Report Error:', error);
    return NextResponse.json({ error: 'Failed to generate performance metrics' }, { status: 500 });
  }
}
