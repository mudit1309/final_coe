import { Router } from "express";
import { enrollments, emailSettings, mailingList, guestLectures, partners, type Enrollment } from "../db";
import {
  clearAdminCookie,
  requireAdmin,
  setAdminCookie,
  validateAdminPassword,
} from "../auth";
import { sendSelectedEmail, sendRejectedEmail } from "../email";

export const adminRouter = Router();

const PAYMENT_STATUSES = new Set<Enrollment["payment_status"]>(["pending", "verified", "rejected"]);
const APP_FEE_STATUSES = new Set<Enrollment["app_fee_status"]>(["pending", "verified", "rejected"]);
const APP_STATUSES = new Set<Enrollment["application_status"]>(["new", "screening", "shortlisted", "selected", "enrolled", "rejected"]);

// --- Auth ---
adminRouter.post("/login", (req, res) => {
  const password = String(req.body?.password || "");
  if (!validateAdminPassword(password)) return res.status(401).json({ error: "Invalid password." });
  setAdminCookie(res);
  res.json({ ok: true });
});

adminRouter.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

// --- Enrollments ---
adminRouter.get("/enrollments", requireAdmin, (_req, res) => {
  res.json({ enrollments: enrollments.list() });
});

adminRouter.patch("/enrollments/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const body = req.body || {};
  const patch: Partial<Enrollment> = {};

  if (body.payment_status !== undefined) {
    if (!PAYMENT_STATUSES.has(body.payment_status)) return res.status(400).json({ error: "Invalid payment_status" });
    patch.payment_status = body.payment_status;
  }
  if (body.app_fee_status !== undefined) {
    if (!APP_FEE_STATUSES.has(body.app_fee_status)) return res.status(400).json({ error: "Invalid app_fee_status" });
    patch.app_fee_status = body.app_fee_status;
  }
  if (body.application_status !== undefined) {
    if (!APP_STATUSES.has(body.application_status)) return res.status(400).json({ error: "Invalid application_status" });
    patch.application_status = body.application_status;
  }
  if (Object.keys(patch).length === 0) return res.status(400).json({ error: "Nothing to update" });

  const existing = enrollments.findById(id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const prevAppStatus = existing.application_status;
  const ok = enrollments.update(id, patch);
  if (!ok) return res.status(404).json({ error: "Not found" });

  let emailSent = false;
  if (patch.application_status && patch.application_status !== prevAppStatus) {
    const updated = enrollments.findById(id)!;
    if (patch.application_status === "selected") {
      mailingList.add(updated.email, updated.name, "auto");
      emailSent = await sendSelectedEmail(updated);
    } else if (patch.application_status === "rejected") {
      emailSent = await sendRejectedEmail(updated);
    }
  }

  res.json({ ok: true, email_sent: emailSent });
});

adminRouter.delete("/enrollments/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const ok = enrollments.delete(id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// enrollments GET
adminRouter.get("/enrollments", requireAdmin, async (_req, res) => {
  try {
    res.json({ enrollments: await enrollments.list() });
  } catch (err) {
    console.error("[admin] enrollments.list failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// email-settings GET
adminRouter.get("/email-settings", requireAdmin, async (_req, res) => {
  try {
    res.json({ settings: await emailSettings.get() });
  } catch (err) {
    console.error("[admin] emailSettings.get failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// partners GET
adminRouter.get("/partners", requireAdmin, async (_req, res) => {
  try {
    res.json({ partners: await partners.list() });
  } catch (err) {
    console.error("[admin] partners.list failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Email Settings ---
adminRouter.get("/email-settings", requireAdmin, (_req, res) => {
  res.json({ settings: emailSettings.get() });
});

adminRouter.put("/email-settings", requireAdmin, (req, res) => {
  const body = req.body || {};
  const patch: Record<string, unknown> = {};
  const allowed = [
    "smtp_host", "smtp_port", "smtp_user", "smtp_pass", "from_email",
    "training_start_date",
    "selected_email_subject", "selected_email_body",
    "rejected_email_subject", "rejected_email_body",
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      patch[key] = key === "smtp_port" ? Number(body[key]) || 587 : String(body[key]);
    }
  }
  res.json({ ok: true, settings: emailSettings.update(patch) });
});

adminRouter.post("/email-test", requireAdmin, async (req, res) => {
  const { to } = req.body || {};
  if (!to) return res.status(400).json({ error: "Provide 'to' email address" });
  const nodemailer = await import("nodemailer");
  const cfg = emailSettings.get();
  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) {
    return res.status(400).json({ error: "SMTP not configured yet" });
  }
  try {
    const transport = nodemailer.createTransport({
      host: cfg.smtp_host, port: cfg.smtp_port,
      secure: cfg.smtp_port === 465,
      auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
    });
    await transport.sendMail({
      from: cfg.from_email || cfg.smtp_user, to,
      subject: "Vizlogic COE — Test Email",
      text: "This is a test email from the Vizlogic admin panel.",
    });
    res.json({ ok: true, message: `Test email sent to ${to}` });
  } catch (err: unknown) {
    res.status(500).json({ error: `Failed to send: ${err instanceof Error ? err.message : "Unknown error"}` });
  }
});

// --- Mailing List ---
adminRouter.get("/mailing-list", requireAdmin, (_req, res) => {
  res.json({ list: mailingList.list() });
});

adminRouter.post("/mailing-list", requireAdmin, (req, res) => {
  const { email, name } = req.body || {};
  if (!email || !String(email).includes("@")) return res.status(400).json({ error: "Valid email required" });
  const added = mailingList.add(String(email).trim(), String(name || "").trim(), "manual");
  if (!added) return res.status(409).json({ error: "Email already in list" });
  res.json({ ok: true });
});

adminRouter.delete("/mailing-list", requireAdmin, (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });
  const removed = mailingList.remove(String(email));
  if (!removed) return res.status(404).json({ error: "Email not found in list" });
  res.json({ ok: true });
});

adminRouter.post("/mailing-list/send", requireAdmin, async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });
  const cfg = emailSettings.get();
  if (!cfg.smtp_host || !cfg.smtp_user || !cfg.smtp_pass) {
    return res.status(400).json({ error: "SMTP not configured. Go to Email Settings first." });
  }
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: cfg.smtp_host, port: cfg.smtp_port,
    secure: cfg.smtp_port === 465,
    auth: { user: cfg.smtp_user, pass: cfg.smtp_pass },
  });
  const trainingDate = cfg.training_start_date;
  let daysUntil = "—";
  if (trainingDate) {
    const diff = Math.ceil((new Date(trainingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    daysUntil = diff > 0 ? String(diff) : "0";
  }
  const vars: Record<string, string> = {
    name: name || "Candidate", training_date: trainingDate || "TBD",
    days_until: daysUntil, unique_id: "—",
  };
  const subject = cfg.selected_email_subject.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] || "");
  const text = cfg.selected_email_body.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] || "");
  try {
    await transport.sendMail({ from: cfg.smtp_user, to: String(email), subject, text });
    res.json({ ok: true, message: `Email sent to ${email}` });
  } catch (err: unknown) {
    res.status(500).json({ error: `Failed: ${err instanceof Error ? err.message : "Unknown error"}` });
  }
});

// --- Guest Lectures ---
adminRouter.get("/guest-lectures", requireAdmin, (_req, res) => {
  res.json({ lectures: guestLectures.list() });
});

adminRouter.delete("/guest-lectures/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const ok = guestLectures.delete(id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// --- OEM & Partners ---
adminRouter.get("/partners", requireAdmin, (_req, res) => {
  res.json({ partners: partners.list() });
});

adminRouter.post("/partners", requireAdmin, (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const category = String(body.category || "partner") as "oem" | "partner";
  const description = String(body.description || "").trim();
  const logo_url = String(body.logo_url || "").trim();
  const website_url = String(body.website_url || "").trim();
  const display_order = Number(body.display_order) || 99;

  if (!name) return res.status(400).json({ error: "Partner name is required." });
  if (!["oem", "partner"].includes(category)) return res.status(400).json({ error: "Category must be 'oem' or 'partner'." });

  const row = partners.create({ name, category, description, logo_url, website_url, display_order });
  res.status(201).json({ ok: true, partner: row });
});

adminRouter.put("/partners/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const body = req.body || {};
  const patch: Record<string, unknown> = {};
  const allowed = ["name", "category", "description", "logo_url", "website_url", "display_order"];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      patch[key] = key === "display_order" ? Number(body[key]) || 99 : String(body[key]).trim();
    }
  }
  const ok = partners.update(id, patch as Parameters<typeof partners.update>[1]);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

adminRouter.delete("/partners/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  const ok = partners.delete(id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});
