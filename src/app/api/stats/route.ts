import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FileStatus } from '@prisma/client';

export async function GET() {
  try {
    const totalFiles = await prisma.file.count();
    const filesAtBranch = await prisma.file.count({
      where: { status: FileStatus.AT_BRANCH }
    });
    const filesInTransit = await prisma.file.count({
      where: { status: FileStatus.IN_TRANSIT }
    });
    
    // For delayed files, we might need a more complex query if we had a due date.
    // For now, let's mock or filter by some logic.
    const delayedFiles = 0; 

    const pendingApprovals = await prisma.fileMovement.count({
      where: { status: 'PENDING' }
    });

    return NextResponse.json({
      totalFiles,
      filesAtBranch,
      filesInTransit,
      delayedFiles,
      pendingApprovals
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
