import crypto from "node:crypto";

const SECRET = process.env.OTP_SECRET || process.env.ADMIN_COOKIE_SECRET || "dev-otp-secret";
const OTP_EXPIRY_MS = 10 * 60 * 1000;   // 10 minutes
const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const store = new Map<string, { code: string; expires: number }>();

function cleanup() {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.expires < now) store.delete(k);
  }
}

export function createOTP(type: "email" | "phone", identifier: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const key = `${type}:${identifier.toLowerCase()}`;
  store.set(key, { code, expires: Date.now() + OTP_EXPIRY_MS });
  if (store.size > 500) cleanup();
  return code;
}

export function verifyOTP(type: "email" | "phone", identifier: string, code: string): boolean {
  const key = `${type}:${identifier.toLowerCase()}`;
  const entry = store.get(key);
  if (!entry) return false;
  if (entry.expires < Date.now()) { store.delete(key); return false; }
  if (entry.code !== code.trim()) return false;
  store.delete(key); // single-use
  return true;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function issueToken(type: "email" | "phone", identifier: string): string {
  const payload = Buffer.from(
    JSON.stringify({ type, value: identifier.toLowerCase(), exp: Date.now() + TOKEN_EXPIRY_MS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string, type: "email" | "phone", identifier: string): boolean {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    if (!payload || !sig) return false;
    if (sign(payload) !== sig) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      data.type === type &&
      data.value === identifier.toLowerCase() &&
      typeof data.exp === "number" &&
      data.exp > Date.now()
    );
  } catch { return false; }
}
