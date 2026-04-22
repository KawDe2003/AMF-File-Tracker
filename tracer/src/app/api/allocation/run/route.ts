import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(request: Request) {
  try {
    // 1. Load config
    let config = await (prisma as any).allocationConfig.findUnique({ where: { id: '1' } });
    if (!config) {
      config = { filesPerAgent: 10 };
    }
    const limit: number = config.filesPerAgent;

    // 2. Get all active calling agents
    const agents = await prisma.user.findMany({
      where: { isCallingAgent: true },
    });

    if (agents.length === 0) {
      return NextResponse.json({ message: 'No calling agents configured. Please mark at least one user as a Calling Agent.' }, { status: 400 });
    }

    // 3. Get all unassigned pending files
    const pendingFiles = await prisma.file.findMany({
      where: {
        currentUserId: null,
        OR: [
          { customerStatus: { not: 'VERIFIED' } },
          { guarantorStatus: { not: 'VERIFIED' } },
        ],
      },
    });

    const shuffledFiles = shuffle(pendingFiles);
    let fileIndex = 0;
    const allocationSummary: { agentId: string; agentName: string; assigned: number }[] = [];

    // 4. For each agent, fill up to the limit
    for (const agent of agents) {
      const currentCount = await prisma.file.count({
        where: { currentUserId: agent.id },
      });
      const needed = Math.max(0, limit - currentCount);
      const toAssign = shuffledFiles.slice(fileIndex, fileIndex + needed);
      fileIndex += toAssign.length;

      if (toAssign.length > 0) {
        await prisma.file.updateMany({
          where: { id: { in: toAssign.map((f) => f.id) } },
          data: { currentUserId: agent.id },
        });
      }

      allocationSummary.push({
        agentId: agent.id,
        agentName: agent.name,
        assigned: toAssign.length,
      });

      if (fileIndex >= shuffledFiles.length) break;
    }

    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'ALLOCATION_RUN', `Manual allocation run: ${fileIndex} files distributed to ${agents.length} agents`);

    return NextResponse.json({
      message: `Allocation complete. ${fileIndex} files distributed across ${agents.length} agent(s).`,
      summary: allocationSummary,
    });
  } catch (error) {
    console.error('Allocation Error:', error);
    return NextResponse.json({ error: 'Allocation engine failed', details: String(error) }, { status: 500 });
  }
}

// Reset: unassign all files from calling agents
export async function DELETE(request: Request) {
  try {
    const agents = await prisma.user.findMany({ where: { isCallingAgent: true } });
    const agentIds = agents.map((a) => a.id);
    const result = await prisma.file.updateMany({
      where: { currentUserId: { in: agentIds } },
      data: { currentUserId: null },
    });

    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'ALLOCATION_RESET', `Manual reset: ${result.count} files unassigned from agents`);

    return NextResponse.json({ message: `Reset complete. ${result.count} file(s) unassigned.` });
  } catch (error) {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
