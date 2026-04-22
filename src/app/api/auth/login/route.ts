import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Record failed attempt
      await recordAuditLog(null, 'LOGIN_FAILURE', `Invalid email attempted: ${email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      await recordAuditLog(user.id, 'LOGIN_FAILURE', `Incorrect password for user: ${email}`);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create session
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isCallingAgent: user.isCallingAgent,
      departmentId: user.departmentId,
    };

    const jwt = await encrypt(sessionData);

    const res = NextResponse.json({ success: true, user: sessionData });
    res.cookies.set('tracer_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60, // 12 hours
      path: '/',
    });

    // Record Login Success
    await recordAuditLog(user.id, 'LOGIN_SUCCESS', `User logged in from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);

    return res;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
}
