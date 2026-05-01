import { Router } from "express";
import { createOTP, verifyOTP, issueToken } from "../otp";
import { sendOTPEmail } from "../email";

export const otpRouter = Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+\d][\d\s\-()]{6,}$/;

const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || "39786f93-7bd6-11ef-8b17-0200cd936042";

async function sendSmsOtp(phone: string, code: string): Promise<void> {
  // Strip spaces, dashes, parentheses and leading + for 2Factor.in
  const cleanPhone = phone.replace(/[\s\-()]/g, "").replace(/^\+/, "");
  const url = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${cleanPhone}/${code}`;
  const r = await fetch(url);
  const data = await r.json() as { Status: string; Details: string };
  if (data.Status !== "Success") {
    throw new Error(`2Factor.in error: ${data.Details}`);
  }
}

// Send OTP to email
otpRouter.post("/send-email", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!emailRe.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  const code = createOTP("email", email);
  try {
    await sendOTPEmail(email, code);
    res.json({ ok: true, message: "OTP sent to your email address." });
  } catch (err) {
    console.error("[otp] Failed to send email OTP:", err);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// Verify email OTP → returns signed token
otpRouter.post("/verify-email", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const code = String(req.body?.code || "").trim();
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!code || code.length !== 6) {
    return res.status(400).json({ error: "Please enter the 6-digit OTP." });
  }
  if (!verifyOTP("email", email, code)) {
    return res.status(400).json({ error: "Incorrect or expired OTP. Please try again." });
  }
  const token = issueToken("email", email);
  res.json({ ok: true, token });
});

// Send OTP to phone via 2Factor.in SMS
otpRouter.post("/send-phone", async (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ error: "Please provide a valid phone number." });
  }
  const code = createOTP("phone", phone);
  try {
    await sendSmsOtp(phone, code);
  } catch (err) {
    console.error("[otp] SMS send failed:", err);
    return res.status(500).json({ error: "Failed to send SMS OTP. Please try again." });
  }
  res.json({ ok: true, message: "OTP sent to your phone number." });
});

// Verify phone OTP → returns signed token
otpRouter.post("/verify-phone", (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  const code = String(req.body?.code || "").trim();
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number." });
  }
  if (!code || code.length !== 6) {
    return res.status(400).json({ error: "Please enter the 6-digit OTP." });
  }
  if (!verifyOTP("phone", phone, code)) {
    return res.status(400).json({ error: "Incorrect or expired OTP. Please try again." });
  }
  const token = issueToken("phone", phone);
  res.json({ ok: true, token });
});
