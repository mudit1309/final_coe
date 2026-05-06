import { Router } from "express";
import { enrollments } from "../db";

export const paymentRouter = Router();

paymentRouter.post("/", async (req, res) => {
  const body = req.body || {};
  const id = Number(body.id);
  const paymentRef = String(body.paymentRef || "").trim();
  const paymentDate = body.paymentDate ? String(body.paymentDate).trim() : undefined;

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: "Valid enrollment id required." });
  }
  if (!paymentRef || paymentRef.length < 4 || paymentRef.length > 80) {
    return res.status(400).json({ error: "Payment reference / UTR required (min 4 chars)." });
  }
  if (!paymentDate) {
    return res.status(400).json({ error: "Date of payment is required." });
  }

  if (!(await enrollments.findById(id))) {
    return res.status(404).json({ error: "Enrollment not found." });
  }

  await enrollments.recordPaymentRef(id, paymentRef, paymentDate);
  res.json({ ok: true, status: "awaiting_verification" });
});
