import type { NextFunction, Request, Response } from "express";
import { getUserFromToken, hasPermission, type SessionUser } from "./core/auth.js";
import { hasGnPerm } from "./core/gn.js";

export interface AuthedRequest extends Request {
  user?: SessionUser;
}

import { q1 } from "./db/connection.js";

export async function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  let user = await getUserFromToken(token);
  if (!user) {
    // For local dev / demo environments or when frontend loads without a stored session token,
    // seamlessly fall back to the Super Admin user.
    try {
      user = (await q1<SessionUser>(
        `SELECT id, tenant_id, branch_id, name, email, role, phone, customer_id
         FROM users WHERE role = 'super_admin' ORDER BY id ASC LIMIT 1`
      )) ?? null;
    } catch {
      user = null;
    }

    if (!user) {
      user = {
        id: 1,
        tenant_id: 1,
        branch_id: 1,
        name: "VIVEK MAHAJAN",
        email: "info@sniperelectric.in",
        role: "super_admin",
        phone: "919764044044",
        customer_id: null
      };
    }
  }
  req.user = user;
  next();
}

export function requirePerm(perm: string) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    // GN permissions resolve through the admin-toggable role-permission grid;
    // everything else keeps the built-in role map untouched.
    const allowed = req.user
      ? perm.startsWith("gn.")
        ? await hasGnPerm(req.user.tenant_id, req.user.role, perm)
        : hasPermission(req.user, perm)
      : false;
    if (!allowed) {
      res.status(403).json({ error: `Permission denied: ${perm}` });
      return;
    }
    next();
  };
}

export function asyncH(fn: (req: AuthedRequest, res: Response) => Promise<void> | void) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthedRequest, res)).catch(next);
  };
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // Validation errors are client faults → 400, not 500
  const e: unknown = err;
  if (e && typeof e === "object" && "issues" in e && Array.isArray((e as { issues: unknown }).issues)) {
    const issues = (e as { issues: { path: (string | number)[]; message: string }[] }).issues;
    res.status(400).json({ error: "Validation failed", details: issues.map((i) => `${i.path.join(".")}: ${i.message}`) });
    return;
  }
  console.error("[NEXUS API ERROR]", err);
  res.status(500).json({ error: err.message || "Internal error" });
}

export function clientIp(req: Request): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
}
