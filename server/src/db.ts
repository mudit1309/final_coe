import fs from "node:fs";
import path from "node:path";

export type Enrollment = {
  id: number;
  unique_id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  course: string;
  plan: string | null;
  notes: string | null;
  // Application fee (₹100 paid at form submission)
  app_fee_ref: string | null;
  app_fee_date: string | null;
  app_fee_status: "pending" | "verified" | "rejected";
  // Course fee (paid after selection)
  payment_status: "pending" | "verified" | "rejected";
  payment_ref: string | null;
  payment_date: string | null;
  application_status:
    | "new"
    | "screening"
    | "shortlisted"
    | "selected"
    | "enrolled"
    | "rejected";
  created_at: string;
  updated_at: string;
};

export type EmailSettings = {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  from_email: string;
  training_start_date: string;
  selected_email_subject: string;
  selected_email_body: string;
  rejected_email_subject: string;
  rejected_email_body: string;
};

export type MailingListEntry = {
  email: string;
  name: string;
  source: "auto" | "manual";
  added_at: string;
};

export type GuestLecture = {
  id: number;
  name: string;
  phone: string;
  email: string;
  place: string;
  topic: string | null;
  created_at: string;
};

export type Partner = {
  id: number;
  name: string;
  category: "oem" | "partner";
  description: string;
  logo_url: string;
  website_url: string;
  display_order: number;
  created_at: string;
};

type DBShape = {
  next_id: number;
  next_gl_id: number;
  next_partner_id: number;
  enrollments: Enrollment[];
  email_settings: EmailSettings;
  mailing_list: MailingListEntry[];
  guest_lectures: GuestLecture[];
  partners: Partner[];
};

const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  smtp_host: "",
  smtp_port: 587,
  smtp_user: "",
  smtp_pass: "",
  from_email: "",
  training_start_date: "",
  selected_email_subject: "Congratulations! You've Been Selected for V-CSAP",
  selected_email_body: `Dear {{name}},

Congratulations! You have been selected for the Vizlogic Certified Sales Automation Professional (V-CSAP) program.

Your Application ID: {{unique_id}}

Your training is scheduled to start on {{training_date}} ({{days_until}} days from now).

IMPORTANT: Please save your Application ID ({{unique_id}}). You will need it to complete your course fee payment at:
[Your site URL]/fee-payment

Steps to complete enrollment:
1. Visit the fee payment page
2. Enter your Application ID: {{unique_id}}
3. Choose your payment plan
4. Scan the QR code to pay via UPI
5. Submit your payment reference number and date

Please ensure you are prepared and available. We will share further details closer to the start date.

Best regards,
Vizlogic COE Team`,
  rejected_email_subject: "Update on Your V-CSAP Application",
  rejected_email_body: `Dear {{name}},

Thank you for your interest in the Vizlogic Certified Sales Automation Professional (V-CSAP) program.

After careful review, we regret to inform you that your application has not been selected for the current batch.

We encourage you to apply again for future batches. Please feel free to reach out if you have any questions.

Best regards,
Vizlogic COE Team`,
};

const DEFAULT: DBShape = {
  next_id: 1,
  next_gl_id: 1,
  next_partner_id: 1,
  enrollments: [],
  email_settings: { ...DEFAULT_EMAIL_SETTINGS },
  mailing_list: [],
  guest_lectures: [],
  partners: [],
};

function resolveDBPath(): string {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.NETLIFY) return path.join("/tmp", "vizlogic.json");
  return path.join(process.cwd(), "data", "vizlogic.json");
}

let _path: string | null = null;
let _state: DBShape | null = null;

function load(): DBShape {
  if (_state) return _state;
  _path = resolveDBPath();
  const dir = path.dirname(_path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(_path)) {
    try {
      const raw = fs.readFileSync(_path, "utf8");
      const parsed = raw.trim() ? JSON.parse(raw) : { ...DEFAULT };
      _state = {
        next_id: Number(parsed.next_id) || 1,
        next_gl_id: Number(parsed.next_gl_id) || 1,
        next_partner_id: Number(parsed.next_partner_id) || 1,
        enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : [],
        email_settings: { ...DEFAULT_EMAIL_SETTINGS, ...(parsed.email_settings || {}) },
        mailing_list: Array.isArray(parsed.mailing_list) ? parsed.mailing_list : [],
        guest_lectures: Array.isArray(parsed.guest_lectures) ? parsed.guest_lectures : [],
        partners: Array.isArray(parsed.partners) ? parsed.partners : [],
      };
    } catch (err) {
      console.error(`[db] Failed to parse ${_path} — starting from empty state. Error:`, err);
      _state = { ...DEFAULT };
    }
  } else {
    _state = { ...DEFAULT };
    persist();
  }
  return _state!;
}

function persist() {
  if (!_path || !_state) return;
  const tmp = _path + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(_state, null, 2), "utf8");
  fs.renameSync(tmp, _path);
}

function nowISO(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export type EnrollmentInput = {
  name: string;
  phone: string;
  email: string;
  country: string;
  course: string;
  plan: string | null;
  notes: string | null;
  app_fee_ref: string | null;
  app_fee_date: string | null;
};

export const enrollments = {
  create(input: EnrollmentInput): Enrollment {
    const state = load();
    const id = state.next_id++;
    const unique_id = "VZ" + String(id).padStart(6, "0");
    const ts = nowISO();
    const row: Enrollment = {
      id,
      unique_id,
      name: input.name,
      phone: input.phone,
      email: input.email,
      country: input.country,
      course: input.course,
      plan: input.plan,
      notes: input.notes,
      app_fee_ref: input.app_fee_ref,
      app_fee_date: input.app_fee_date,
      app_fee_status: "pending",
      payment_status: "pending",
      payment_ref: null,
      payment_date: null,
      application_status: "new",
      created_at: ts,
      updated_at: ts,
    };
    state.enrollments.push(row);
    persist();
    return row;
  },

  list(): Enrollment[] {
    const state = load();
    return state.enrollments
      .slice()
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 500);
  },

  findById(id: number): Enrollment | null {
    const state = load();
    return state.enrollments.find((e) => e.id === id) || null;
  },

  findByUniqueId(uniqueId: string): Enrollment | null {
    const state = load();
    const upper = uniqueId.toUpperCase();
    return state.enrollments.find((e) => e.unique_id === upper) || null;
  },

  findByPhone(phone: string): Enrollment | null {
    const state = load();
    const normalized = phone.trim().replace(/\s+/g, "");
    return (
      state.enrollments
        .slice()
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        .find((e) => e.phone.replace(/\s+/g, "") === normalized) || null
    );
  },

  recordPaymentRef(id: number, paymentRef: string, paymentDate?: string): boolean {
    const state = load();
    const row = state.enrollments.find((e) => e.id === id);
    if (!row) return false;
    row.payment_ref = paymentRef;
    row.payment_date = paymentDate || null;
    row.payment_status = "pending";
    row.updated_at = nowISO();
    persist();
    return true;
  },

  update(id: number, patch: Partial<Enrollment>): boolean {
    const state = load();
    const row = state.enrollments.find((e) => e.id === id);
    if (!row) return false;
    if (patch.payment_status !== undefined) row.payment_status = patch.payment_status;
    if (patch.application_status !== undefined) row.application_status = patch.application_status;
    if (patch.app_fee_status !== undefined) row.app_fee_status = patch.app_fee_status;
    if (patch.plan !== undefined) row.plan = patch.plan;
    row.updated_at = nowISO();
    persist();
    return true;
  },

  delete(id: number): boolean {
    const state = load();
    const before = state.enrollments.length;
    state.enrollments = state.enrollments.filter((e) => e.id !== id);
    const changed = state.enrollments.length !== before;
    if (changed) persist();
    return changed;
  },
};

export const mailingList = {
  list(): MailingListEntry[] {
    return load().mailing_list.slice();
  },

  add(email: string, name: string, source: "auto" | "manual"): boolean {
    const state = load();
    const lower = email.toLowerCase();
    if (state.mailing_list.some((e) => e.email.toLowerCase() === lower)) return false;
    state.mailing_list.push({ email: lower, name, source, added_at: nowISO() });
    persist();
    return true;
  },

  remove(email: string): boolean {
    const state = load();
    const lower = email.toLowerCase();
    const before = state.mailing_list.length;
    state.mailing_list = state.mailing_list.filter((e) => e.email.toLowerCase() !== lower);
    const changed = state.mailing_list.length !== before;
    if (changed) persist();
    return changed;
  },
};

export const emailSettings = {
  get(): EmailSettings {
    const state = load();
    return { ...state.email_settings };
  },

  update(patch: Partial<EmailSettings>): EmailSettings {
    const state = load();
    Object.assign(state.email_settings, patch);
    persist();
    return { ...state.email_settings };
  },
};

export type GuestLectureInput = {
  name: string;
  phone: string;
  email: string;
  place: string;
  topic: string | null;
};

export const guestLectures = {
  create(input: GuestLectureInput): GuestLecture {
    const state = load();
    const id = state.next_gl_id++;
    const row: GuestLecture = {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email,
      place: input.place,
      topic: input.topic,
      created_at: nowISO(),
    };
    state.guest_lectures.push(row);
    persist();
    return row;
  },

  list(): GuestLecture[] {
    return load().guest_lectures.slice().sort((a, b) => b.id - a.id);
  },

  delete(id: number): boolean {
    const state = load();
    const before = state.guest_lectures.length;
    state.guest_lectures = state.guest_lectures.filter((g) => g.id !== id);
    const changed = state.guest_lectures.length !== before;
    if (changed) persist();
    return changed;
  },
};

export type PartnerInput = {
  name: string;
  category: "oem" | "partner";
  description: string;
  logo_url: string;
  website_url: string;
  display_order: number;
};

export const partners = {
  list(): Partner[] {
    return load().partners.slice().sort((a, b) => a.display_order - b.display_order);
  },

  create(input: PartnerInput): Partner {
    const state = load();
    const id = state.next_partner_id++;
    const row: Partner = { id, ...input, created_at: nowISO() };
    state.partners.push(row);
    persist();
    return row;
  },

  update(id: number, patch: Partial<PartnerInput>): boolean {
    const state = load();
    const row = state.partners.find((p) => p.id === id);
    if (!row) return false;
    Object.assign(row, patch);
    persist();
    return true;
  },

  delete(id: number): boolean {
    const state = load();
    const before = state.partners.length;
    state.partners = state.partners.filter((p) => p.id !== id);
    const changed = state.partners.length !== before;
    if (changed) persist();
    return changed;
  },
};
