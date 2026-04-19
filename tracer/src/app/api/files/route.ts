import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q');

    let files;
    
    if (search) {
      files = await prisma.file.findMany({
        where: {
          OR: [
            { nic: { contains: search } },
            { vehicleNo: { contains: search } },
            { leasingCRNo: { contains: search } },
            { id: { contains: search } },
          ]
        },
        include: {
          currentDept: true
        }
      });
    } else {
      files = await prisma.file.findMany({
        include: {
          currentDept: true
        },
        orderBy: { priority: 'desc' }
      });
    }

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newFile = await prisma.file.create({
      data: {
        title: body.title,
        fileType: body.fileType,
        nic: body.nic,
        leasingCRNo: body.leasingCRNo,
        vehicleNo: body.vehicleNo,
        priority: body.priority || 'LOW',
        // Mock currentDeptId for initial registration
        currentDeptId: body.currentDeptId || 'branch-id',
      }
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
