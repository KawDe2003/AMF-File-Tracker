import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagNo = searchParams.get('tagNo');
    const vehicleNo = searchParams.get('vehicleNo');

    const [tagDup, vehicleDup] = await Promise.all([
      tagNo && tagNo.length >= 3 ? prisma.file.findFirst({ where: { tagNo } }) : null,
      vehicleNo && vehicleNo.length >= 3 ? prisma.file.findFirst({ where: { vehicleNo } }) : null,
    ]);

    return NextResponse.json({
      tagNo: !!tagDup,
      vehicleNo: !!vehicleDup,
    });
  } catch (error) {
    return NextResponse.json({ tagNo: false, vehicleNo: false }, { status: 500 });
  }
}
