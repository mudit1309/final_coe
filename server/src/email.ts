import nodemailer from "nodemailer";
import { emailSettings, type Enrollment } from "./db";

function createTransport() {
  const cfg = emailSettings.get();
  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) return null;
  return nodemailer.createTransport({
    host: cfg.smtp_host,
    port: cfg.smtp_port,
    secure: cfg.smtp_port === 465,
    auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
  });
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || "");
}

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    console.log(`[OTP-DEV] Email OTP for ${to}: ${otp}  (SMTP not configured — use this code in development)`);
    return;
  }
  const cfg = emailSettings.get();
  await transport.sendMail({
    from: `"Vizshila" <${cfg.smtp_user}>`,
    to,
    subject: "Your Vizlogic COE Verification Code",
    text: `Your OTP for Vizlogic COE application verification is: ${otp}\n\nThis code is valid for 10 minutes. Do not share it with anyone.`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
<h2 style="color:#0b1437;margin:0 0 8px">Vizlogic COE — Verification Code</h2>
<p style="color:#475569;margin:0 0 24px">Use the code below to verify your email for the V-CSAP application.</p>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
<div style="font-size:40px;font-weight:700;letter-spacing:10px;color:#0b1437">${otp}</div>
<div style="color:#94a3b8;font-size:13px;margin-top:8px">Valid for 10 minutes</div>
</div>
<p style="color:#94a3b8;font-size:12px;margin:0">If you did not request this code, you can safely ignore this email.</p>
</div>`,
  });
  console.log(`[email] OTP sent to ${to}`);
}

export async function sendSelectedEmail(enrollment: Enrollment): Promise<boolean> {
  const transport = createTransport();
  if (!transport) {
    console.log("[email] SMTP not configured — skipping selected email");
    return false;
  }
  const cfg = emailSettings.get();
  const trainingDate = cfg.training_start_date;
  let daysUntil = "—";
  if (trainingDate) {
    const diff = Math.ceil(
      (new Date(trainingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    daysUntil = diff > 0 ? String(diff) : "0";
  }

  const vars: Record<string, string> = {
    name: enrollment.name,
    email: enrollment.email,
    training_date: trainingDate || "TBD",
    days_until: daysUntil,
    course: enrollment.course,
    unique_id: enrollment.unique_id || `#${enrollment.id}`,
  };

  try {
    await transport.sendMail({
      from: cfg.from_email || cfg.smtp_user,
      to: enrollment.email,
      subject: interpolate(cfg.selected_email_subject, vars),
      text: interpolate(cfg.selected_email_body, vars),
    });
    console.log(`[email] Selected email sent to ${enrollment.email}`);
    return true;
  } catch (err) {
    console.error("[email] Failed to send selected email:", err);
    return false;
  }
}

export async function sendRejectedEmail(enrollment: Enrollment): Promise<boolean> {
  const transport = createTransport();
  if (!transport) {
    console.log("[email] SMTP not configured — skipping rejected email");
    return false;
  }
  const cfg = emailSettings.get();
  const vars: Record<string, string> = {
    name: enrollment.name,
    email: enrollment.email,
    course: enrollment.course,
  };

  try {
    await transport.sendMail({
      from: cfg.from_email || cfg.smtp_user,
      to: enrollment.email,
      subject: interpolate(cfg.rejected_email_subject, vars),
      text: interpolate(cfg.rejected_email_body, vars),
    });
    console.log(`[email] Rejected email sent to ${enrollment.email}`);
    return true;
  } catch (err) {
    console.error("[email] Failed to send rejected email:", err);
    return false;
  }
}
