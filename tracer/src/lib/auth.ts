import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const encodedKey = new TextEncoder().encode(JWT_SECRET_KEY);

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  isCallingAgent: boolean;
  departmentId?: string | null;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null; /* Invalid token */
  }
}
