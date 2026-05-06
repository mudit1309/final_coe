import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { enrollRouter } from "./routes/enroll";
import { paymentRouter } from "./routes/payment";
import { adminRouter } from "./routes/admin";
import { otpRouter } from "./routes/otp";
import { guestLectureRouter } from "./routes/guest_lecture";
import { feeLookupRouter } from "./routes/fee_lookup";
import { candidateRouter } from "./routes/candidate";
import { emailSettings, partners } from "./db";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use((req, _res, next) => {
  if (req.path.startsWith("/api/")) {
    console.log(`[api] ${req.method} ${req.path}`);
  }
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "vizlogic-api" });
});

// Public: batch start date for the Admission page banner
app.get("/api/batch-date", async (_req, res) => {
  const cfg = await emailSettings.get();
  const raw = cfg.training_start_date;
  let formatted: string | null = null;
  if (raw) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      formatted = `${day}/${month}/${year}`;
    }
  }
  res.json({ date: formatted });
});

// Public: OEM & Partners list
app.get("/api/partners", async (_req, res) => {
  res.json({ partners: await partners.list() });
});

app.use("/api/otp", otpRouter);
app.use("/api/enroll", enrollRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/guest-lecture", guestLectureRouter);
app.use("/api/fee-lookup", feeLookupRouter);
app.use("/api/candidate", candidateRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

export { app };
process.on("unhandledRejection", (reason) => {
  console.error("[fatal] Unhandled rejection:", reason);
});
if (!process.env.NETLIFY) {
  const PORT = Number(process.env.PORT) || 3001;
  const clientDist = path.resolve(__dirname, "..", "..", "client", "dist");
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`→ Vizlogic API listening on http://localhost:${PORT}`);
  });
}
