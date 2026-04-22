import prisma from './prisma';

/**
 * Standard utility to record an audit log entry.
 * @param userId - The ID of the user performing the action (optional for failed logins).
 * @param action - A descriptive action name (e.g., LOGIN, KYC_UPDATE).
 * @param details - Optional JSON string or text describing the change.
 */
export async function recordAuditLog(
  userId: string | null | undefined,
  action: string,
  details?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        details,
      },
    });
  } catch (error) {
    console.error('FAILED_TO_LOG_AUDIT:', error);
    // We don't want audit logging failures to crash the main request
  }
}
