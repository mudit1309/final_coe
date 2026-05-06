import { Router } from "express";
import { enrollments } from "../db";
import { verifyToken } from "../otp";

export const enrollRouter = Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+\d][\d\s\-()]{6,}$/;

const COURSES = new Set([
  "V-CSAP (Full Program)",
  "Foundation Module Only",
  "Technical Training Only",
  "Implementation Specialist Track",
]);

enrollRouter.post("/", async (req, res) => {
  const body = req.body || {};

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const country = String(body.country || "").trim();
  const course = String(body.course || "").trim();
  const notes = body.notes ? String(body.notes).slice(0, 1000) : null;
  const emailOtpToken = String(body.email_otp_token || "");
  const phoneOtpToken = String(body.phone_otp_token || "");
  const app_fee_ref = body.app_fee_ref ? String(body.app_fee_ref).trim() : null;
  const app_fee_date = body.app_fee_date ? String(body.app_fee_date).trim() : null;

  if (!name || name.length < 2 || name.length > 120) {
    return res.status(400).json({ error: "Please provide a valid name." });
  }
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ error: "Please provide a valid phone number." });
  }
  if (!emailRe.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }
  if (!country || country.length > 80) {
    return res.status(400).json({ error: "Please provide a country." });
  }
  if (!COURSES.has(course)) {
    return res.status(400).json({ error: "Please select a valid course." });
  }
  if (!app_fee_ref || app_fee_ref.length < 4) {
    return res.status(400).json({ error: "Please provide a valid application fee UTR (min 4 chars)." });
  }
  if (!app_fee_date) {
    return res.status(400).json({ error: "Please provide the date of application fee payment." });
  }

  if (!verifyToken(emailOtpToken, "email", email)) {
    return res.status(400).json({ error: "Email not verified. Please complete OTP verification for your email." });
  }
  if (!verifyToken(phoneOtpToken, "phone", phone)) {
    return res.status(400).json({ error: "Phone not verified. Please complete OTP verification for your phone number." });
  }

  const row = await enrollments.create({
    name, phone, email, country, course,
    plan: null,
    notes,
    app_fee_ref,
    app_fee_date,
  });

  res.status(201).json({ id: row.id, unique_id: row.unique_id, status: "received" });
});
