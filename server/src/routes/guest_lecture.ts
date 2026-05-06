import { Router } from "express";
import { guestLectures } from "../db";

export const guestLectureRouter = Router();

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+\d][\d\s\-()]{6,}$/;

guestLectureRouter.post("/", async (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const place = String(body.place || "").trim();
  const topic = body.topic ? String(body.topic).trim().slice(0, 500) : null;

  if (!name || name.length < 2 || name.length > 120) {
    return res.status(400).json({ error: "Please provide your full name." });
  }
  if (!phoneRe.test(phone)) {
    return res.status(400).json({ error: "Please provide a valid phone number." });
  }
  if (!emailRe.test(email) || email.length > 200) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (!place || place.length < 2 || place.length > 200) {
    return res.status(400).json({ error: "Please provide your city / location." });
  }

  const row = await guestLectures.create({ name, phone, email, place, topic });
  res.status(201).json({ ok: true, id: row.id });
});
