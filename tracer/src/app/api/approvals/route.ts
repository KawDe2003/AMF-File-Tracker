import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { MovementStatus, ApprovalDecision } from '@prisma/client';

export async function GET() {
  try {
    const movements = await prisma.fileMovement.findMany({
      where: { status: MovementStatus.PENDING },
      include: {
        file: true,
        sender: true,
        fromDept: true,
        toDept: true,
      },
    });
    return NextResponse.json(movements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pending approvals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { movementId, decision, comments, managerId } = await request.json();

    const approval = await prisma.approval.create({
      data: {
        movementId,
        decision: decision === 'APPROVE' ? ApprovalDecision.APPROVED : ApprovalDecision.REJECTED,
        comments,
        managerId,
      },
    });

    // Update movement status
    await prisma.fileMovement.update({
      where: { id: movementId },
      data: {
        status: decision === 'APPROVE' ? MovementStatus.APPROVED : MovementStatus.REJECTED,
      },
    });

    // If approved, update file status/location? Or just wait for completion.
    // For now, let's keep it simple.

    return NextResponse.json(approval);
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}
