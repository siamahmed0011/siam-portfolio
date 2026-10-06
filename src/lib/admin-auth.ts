import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, type Session, type User } from "@/lib/auth";

export interface AdminAuthResult {
  session: Session["session"];
  user: User;
}

export class AdminAuthorizationError extends Error {
  public readonly status: 401 | 403;

  constructor(
    message: string = "Forbidden: Administrator access required",
    status: 401 | 403 = 403,
  ) {
    super(message);
    this.name = "AdminAuthorizationError";
    this.status = status;
  }
}

/**
 * Checks whether the Better Auth role string contains the admin role.
 * Better Auth may store multiple roles as a comma-separated string.
 */
function hasAdminRole(role?: string | null): boolean {
  if (!role) return false;

  return role
    .split(",")
    .map((item) => item.trim())
    .includes("admin");
}

/**
 * Returns the current authenticated administrator session.
 *
 * Returns null when:
 * - there is no authenticated session
 * - the user is banned
 * - the user does not have the admin role
 */
export async function getAdminSession(): Promise<AdminAuthResult | null> {
  const reqHeaders = await headers();

  const sessionData = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionData?.user) {
    return null;
  }

  if (sessionData.user.banned) {
    return null;
  }

  if (!hasAdminRole(sessionData.user.role)) {
    return null;
  }

  return {
    session: sessionData.session,
    user: sessionData.user,
  };
}

/**
 * Protects Server Components/layouts/pages.
 *
 * Anonymous users:
 *   -> /admin/login
 *
 * Authenticated but unauthorized/banned users:
 *   -> /admin/forbidden
 *
 * Administrators:
 *   -> allowed
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const reqHeaders = await headers();

  const sessionData = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionData?.user) {
    redirect("/admin/login");
  }

  if (sessionData.user.banned || !hasAdminRole(sessionData.user.role)) {
    redirect("/admin/forbidden");
  }

  return {
    session: sessionData.session,
    user: sessionData.user,
  };
}

/**
 * Protects Server Actions, Route Handlers and other server-side mutations.
 *
 * Throws:
 * 401 -> not authenticated
 * 403 -> authenticated but not authorized
 */
export async function assertAdmin(): Promise<AdminAuthResult> {
  const reqHeaders = await headers();

  const sessionData = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionData?.user) {
    throw new AdminAuthorizationError(
      "Unauthorized: Authentication required",
      401,
    );
  }

  if (sessionData.user.banned) {
    throw new AdminAuthorizationError(
      "Forbidden: Account is suspended",
      403,
    );
  }

  if (!hasAdminRole(sessionData.user.role)) {
    throw new AdminAuthorizationError(
      "Forbidden: Administrator access required",
      403,
    );
  }

  return {
    session: sessionData.session,
    user: sessionData.user,
  };
}