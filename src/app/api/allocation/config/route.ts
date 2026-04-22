import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    // Get or create a singleton config (id = "1")
    let config = await (prisma as any).allocationConfig.findUnique({ where: { id: '1' } });
    if (!config) {
      config = await (prisma as any).allocationConfig.create({
        data: { id: '1', filesPerAgent: 10, autoAllocate: false },
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = await (prisma as any).allocationConfig.upsert({
      where: { id: '1' },
      create: { id: '1', filesPerAgent: body.filesPerAgent ?? 10, autoAllocate: body.autoAllocate ?? false },
      update: { filesPerAgent: body.filesPerAgent, autoAllocate: body.autoAllocate },
    });

    // Audit Log
    const adminId = request.headers.get('x-user-id') || 'SYSTEM';
    await recordAuditLog(adminId, 'ALLOCATION_CONFIG_UPDATE', `Updated allocation config: limit=${body.filesPerAgent}, auto=${body.autoAllocate}`);

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
