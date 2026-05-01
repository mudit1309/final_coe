import { Router } from "express";
import { enrollments } from "../db";

export const feeLookupRouter = Router();

feeLookupRouter.post("/", (req, res) => {
  const uniqueId = String(req.body?.unique_id || "").trim().toUpperCase();
  if (!uniqueId || uniqueId.length < 3) {
    return res.status(400).json({ error: "Please enter your Application ID (e.g. VZ000001)." });
  }

  const enrollment = enrollments.findByUniqueId(uniqueId);
  if (!enrollment) {
    return res.status(404).json({ error: "Application ID not found. Please check and try again." });
  }

  const { application_status, payment_status } = enrollment;

  if (application_status === "rejected") {
    return res.status(403).json({
      error: "Your application was not selected. Please contact vizshila@vizlogicindia.in for more information.",
      status: application_status,
    });
  }

  if (application_status !== "selected" && application_status !== "enrolled") {
    return res.status(403).json({
      error: "Your application is still under review. You will receive an email when you are selected.",
      status: application_status,
    });
  }

  if (payment_status === "verified") {
    return res.json({
      ok: true,
      status: "already_paid",
      message: "Your fee payment has already been verified. You are enrolled! Our team will contact you shortly.",
      enrollment: {
        name: enrollment.name,
        course: enrollment.course,
        unique_id: enrollment.unique_id,
        payment_status: enrollment.payment_status,
        application_status: enrollment.application_status,
      },
    });
  }

  res.json({
    ok: true,
    status: "payment_due",
    enrollment: {
      id: enrollment.id,
      name: enrollment.name,
      course: enrollment.course,
      plan: enrollment.plan,
      unique_id: enrollment.unique_id,
      payment_status: enrollment.payment_status,
      application_status: enrollment.application_status,
    },
  });
});
