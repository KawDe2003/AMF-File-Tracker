import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tracer_session')?.value;
  let session = await decrypt(token);

  // --- TEMPORARY LOGIN BYPASS ---
  if (!session) {
    session = {
      id: "7b1ea6fe-7364-43c5-bd64-64999cde3802",
      email: "admin@amf.lk",
      name: "System Administrator",
      role: "ADMIN",
      isCallingAgent: false,
    } as any;
  }
  // ------------------------------

  return NextResponse.json(session);
}
