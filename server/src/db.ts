import { MongoClient, Db } from "mongodb";

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
  app_fee_ref: string | null;
  app_fee_date: string | null;
  app_fee_status: "pending" | "verified" | "rejected";
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

let _client: MongoClient | null = null;
let _db: Db | null = null;

async function getDb(): Promise<Db> {
  if (_db) return _db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");
  _client = new MongoClient(uri);
  await _client.connect();
  _db = _client.db();
  console.log("[db] Connected to MongoDB");
  return _db;
}

async function nextSeq(name: string): Promise<number> {
  const db = await getDb();
  const result = await db.collection("counters").findOneAndUpdate(
    { _id: name as unknown as object },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return (result as unknown as { seq: number }).seq as number;
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
  async create(input: EnrollmentInput): Promise<Enrollment> {
    const db = await getDb();
    const id = await nextSeq("enrollment_id");
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
    await db.collection<Enrollment>("enrollments").insertOne(row as any);
    return row;
  },

  async list(): Promise<Enrollment[]> {
    const db = await getDb();
    return db
      .collection<Enrollment>("enrollments")
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(500)
      .toArray() as unknown as Enrollment[];
  },

  async findById(id: number): Promise<Enrollment | null> {
    const db = await getDb();
    return db
      .collection<Enrollment>("enrollments")
      .findOne({ id }, { projection: { _id: 0 } }) as unknown as Enrollment | null;
  },

  async findByUniqueId(uniqueId: string): Promise<Enrollment | null> {
    const db = await getDb();
    return db
      .collection<Enrollment>("enrollments")
      .findOne({ unique_id: uniqueId.toUpperCase() }, { projection: { _id: 0 } }) as unknown as Enrollment | null;
  },

  async findByPhone(phone: string): Promise<Enrollment | null> {
    const db = await getDb();
    const normalized = phone.trim().replace(/\s+/g, "");
    const all = await db
      .collection<Enrollment>("enrollments")
      .find({}, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray() as unknown as Enrollment[];
    return all.find((e) => e.phone.replace(/\s+/g, "") === normalized) || null;
  },

  async recordPaymentRef(id: number, paymentRef: string, paymentDate?: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("enrollments").updateOne(
      { id },
      {
        $set: {
          payment_ref: paymentRef,
          payment_date: paymentDate || null,
          payment_status: "pending",
          updated_at: nowISO(),
        },
      },
    );
    return result.matchedCount > 0;
  },

  async update(id: number, patch: Partial<Enrollment>): Promise<boolean> {
    const db = await getDb();
    const set: Record<string, unknown> = { updated_at: nowISO() };
    if (patch.payment_status !== undefined) set.payment_status = patch.payment_status;
    if (patch.application_status !== undefined) set.application_status = patch.application_status;
    if (patch.app_fee_status !== undefined) set.app_fee_status = patch.app_fee_status;
    if (patch.plan !== undefined) set.plan = patch.plan;
    const result = await db.collection("enrollments").updateOne({ id }, { $set: set });
    return result.matchedCount > 0;
  },

  async delete(id: number): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("enrollments").deleteOne({ id });
    return result.deletedCount > 0;
  },
};

export const mailingList = {
  async list(): Promise<MailingListEntry[]> {
    const db = await getDb();
    return db
      .collection<MailingListEntry>("mailing_list")
      .find({}, { projection: { _id: 0 } })
      .toArray() as unknown as MailingListEntry[];
  },

  async add(email: string, name: string, source: "auto" | "manual"): Promise<boolean> {
    const db = await getDb();
    const lower = email.toLowerCase();
    const existing = await db.collection("mailing_list").findOne({ email: lower });
    if (existing) return false;
    await db.collection("mailing_list").insertOne({ email: lower, name, source, added_at: nowISO() });
    return true;
  },

  async remove(email: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("mailing_list").deleteOne({ email: email.toLowerCase() });
    return result.deletedCount > 0;
  },
};

export const emailSettings = {
  async get(): Promise<EmailSettings> {
    const db = await getDb();
    const doc = await db.collection("email_settings").findOne({ _id: "settings" as unknown as object });
    if (!doc) return { ...DEFAULT_EMAIL_SETTINGS };
    const { _id, ...rest } = doc as any;
    return { ...DEFAULT_EMAIL_SETTINGS, ...rest } as EmailSettings;
  },

  async update(patch: Partial<EmailSettings>): Promise<EmailSettings> {
    const db = await getDb();
    await db.collection("email_settings").updateOne(
      { _id: "settings" as unknown as object },
      { $set: patch },
      { upsert: true },
    );
    return this.get();
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
  async create(input: GuestLectureInput): Promise<GuestLecture> {
    const db = await getDb();
    const id = await nextSeq("guest_lecture_id");
    const row: GuestLecture = { id, ...input, created_at: nowISO() };
    await db.collection("guest_lectures").insertOne(row as any);
    return row;
  },

  async list(): Promise<GuestLecture[]> {
    const db = await getDb();
    return db
      .collection<GuestLecture>("guest_lectures")
      .find({}, { projection: { _id: 0 } })
      .sort({ id: -1 })
      .toArray() as unknown as GuestLecture[];
  },

  async delete(id: number): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("guest_lectures").deleteOne({ id });
    return result.deletedCount > 0;
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
  async list(): Promise<Partner[]> {
    const db = await getDb();
    return db
      .collection<Partner>("partners")
      .find({}, { projection: { _id: 0 } })
      .sort({ display_order: 1 })
      .toArray() as unknown as Partner[];
  },

  async create(input: PartnerInput): Promise<Partner> {
    const db = await getDb();
    const id = await nextSeq("partner_id");
    const row: Partner = { id, ...input, created_at: nowISO() };
    await db.collection("partners").insertOne(row as any);
    return row;
  },

  async update(id: number, patch: Partial<PartnerInput>): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("partners").updateOne({ id }, { $set: patch });
    return result.matchedCount > 0;
  },

  async delete(id: number): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection("partners").deleteOne({ id });
    return result.deletedCount > 0;
  },
};
