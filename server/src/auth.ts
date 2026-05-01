import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "vz_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  return (
    process.env.ADMIN_COOKIE_SECRET ||
    "vizlogic-dev-secret-change-me-in-production"
  );
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createAdminToken(): string {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
    role: "admin" as const,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  if (sign(body) !== sig) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (payload.role !== "admin") return false;
    if (typeof payload.exp !== "number") return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function setAdminCookie(res: Response) {
  res.cookie(COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS * 1000,
    path: "/",
  });
}

export function clearAdminCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function validateAdminPassword(pw: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "vizlogic-admin-2026";
  if (!pw || pw.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(pw), Buffer.from(expected));
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
