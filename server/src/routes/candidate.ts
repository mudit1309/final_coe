import { Router } from "express";
import { enrollments } from "../db";
import { createOTP, verifyOTP, issueToken, verifyToken } from "../otp";
import { sendOTPEmail } from "../email";

export const candidateRouter = Router();

const phoneRe = /^[+\d][\d\s\-()]{6,}$/;

const TWOFACTOR_API_KEY = process.env.TWOFACTOR_API_KEY || "39786f93-7bd6-11ef-8b17-0200cd936042";

async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const cleanPhone = phone.replace(/[\s\-()]/g, "").replace(/^\+/, "");
  const url = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${cleanPhone}/${code}`;
  const r = await fetch(url);
  const data = await r.json() as { Status: string; Details: string };
  if (data.Status !== "Success") {
    throw new Error(`2Factor.in error: ${data.Details}`);
  }
}

// Send phone OTP for candidate login
candidateRouter.post("/send-otp", async (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ error: "Please provide a valid phone number." });
  }

  const enrollment = enrollments.findByPhone(phone);
  if (!enrollment) {
    return res.status(404).json({ error: "No application found with this phone number. Please apply first." });
  }

  const code = createOTP("phone", phone);

  // Send SMS via 2Factor.in; fall back to email if SMS fails
  try {
    await sendSmsOtp(phone, code);
  } catch (smsErr) {
    console.error("[candidate] SMS failed, falling back to email:", smsErr);
    try {
      await sendOTPEmail(enrollment.email, code);
    } catch (emailErr) {
      console.error("[candidate] Email fallback also failed:", emailErr);
      return res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
  }

  res.json({ ok: true, message: "OTP sent to your registered phone number." });
});

// Verify OTP and return application status
candidateRouter.post("/verify", (req, res) => {
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

  const enrollment = enrollments.findByPhone(phone);
  if (!enrollment) {
    return res.status(404).json({ error: "Application not found." });
  }

  const token = issueToken("phone", phone);
  res.json({ ok: true, token, enrollment: sanitize(enrollment) });
});

// Get status with token (for refreshing without re-OTP)
candidateRouter.post("/status", (req, res) => {
  const phone = String(req.body?.phone || "").trim();
  const token = String(req.body?.token || "");

  if (!verifyToken(token, "phone", phone)) {
    return res.status(401).json({ error: "Session expired. Please login again." });
  }

  const enrollment = enrollments.findByPhone(phone);
  if (!enrollment) {
    return res.status(404).json({ error: "Application not found." });
  }

  res.json({ ok: true, enrollment: sanitize(enrollment) });
});

function sanitize(e: ReturnType<typeof enrollments.findByPhone>) {
  if (!e) return null;
  return {
    unique_id: e.unique_id,
    name: e.name,
    course: e.course,
    plan: e.plan,
    application_status: e.application_status,
    payment_status: e.payment_status,
    app_fee_status: e.app_fee_status,
    created_at: e.created_at,
  };
}
