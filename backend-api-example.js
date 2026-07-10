/*
  PowerMind backend: email/password accounts with SMTP email verification.
  Changes in this file:
  - Removed third-party/social authentication usage.
  - Added secure signup, login, OTP hashing, resend limits, verification limits, and SMTP email sending.
  - Kept the existing Supabase database client for students, courses, and purchases.

  Environment variables needed:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  SMTP_HOST
  SMTP_PORT
  SMTP_SECURE=false
  SMTP_USER
  SMTP_PASS
  SMTP_FROM="PowerMind <no-reply@yourdomain.com>"
  OTP_SECRET=change-this-long-random-secret
  PUBLIC_SITE_URL=https://nmp.github.io
  PAYMENT_WEBHOOK_SECRET

  Install:
  npm i express cors dotenv @supabase/supabase-js nodemailer

  Run:
  node backend-api-example.js
*/

require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "32kb" }));

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_WINDOW_MS = 60 * 60 * 1000;
const MAX_RESENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 8;

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const publicSiteUrl = () => (process.env.PUBLIC_SITE_URL || "https://nmp.github.io").replace(/\/$/, "");

const getTransporter = () => {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "OTP_SECRET"];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) throw new Error(`Missing email environment variables: ${missing.join(", ")}`);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
};

const verifyPassword = (password, storedHash = "") => {
  const [scheme, salt, hash] = storedHash.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
};

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (email, code) => {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(`${normalizeEmail(email)}:${code}`)
    .digest("hex");
};

const buildVerificationEmail = ({ name, code }) => {
  const safeName = String(name || "Student").replace(/[<>&"]/g, char => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;"
  }[char]));

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Verify your PowerMind email</title>
</head>
<body style="margin:0;background:#07111f;font-family:Arial,Helvetica,sans-serif;color:#e5eefb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07111f;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#0e1628;border:1px solid rgba(255,255,255,.08);border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:26px 28px 10px;">
              <div style="display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:#fff;">
                <span style="display:inline-block;width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#06b6d4,#f59e0b);text-align:center;line-height:34px;color:#07111f;">P</span>
                PowerMind
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 28px 28px;">
              <h1 style="margin:0 0 10px;font-size:24px;line-height:1.25;color:#ffffff;">Verify your email</h1>
              <p style="margin:0 0 18px;color:#b6c4d8;line-height:1.6;">Hi ${safeName}, use this 6-digit code to finish creating your PowerMind account.</p>
              <div style="background:#111c31;border:1px solid rgba(255,255,255,.1);border-radius:14px;text-align:center;padding:22px;margin:20px 0;">
                <div style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#67e8f9;margin-bottom:8px;">Verification Code</div>
                <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#ffffff;">${code}</div>
              </div>
              <p style="margin:0 0 10px;color:#b6c4d8;line-height:1.6;">This code expires in 5 minutes.</p>
              <p style="margin:0;color:#fbbf24;line-height:1.6;">If you did not request this, ignore this email and do not share the code with anyone.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendVerificationEmail = async ({ email, name, code }) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your PowerMind verification code",
    html: buildVerificationEmail({ name, code }),
    text: `Your PowerMind verification code is ${code}. It expires in 5 minutes.`
  });
};

const getStudentByEmail = async (email) => {
  const { data, error } = await supabaseAdmin
    .from("students")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  if (error) throw error;
  return data;
};

const loadPurchases = async (studentId) => {
  const { data, error } = await supabaseAdmin
    .from("purchases")
    .select("course_id")
    .eq("student_id", studentId)
    .eq("status", "paid");
  if (error) throw error;
  return (data || []).map(row => row.course_id);
};

const toFrontendUser = async (student) => ({
  id: student.id,
  name: student.name,
  dob: student.dob,
  email: student.email,
  photo: student.photo,
  classLevel: student.class_level || "More",
  purchases: await loadPurchases(student.id)
});

const canSendOtp = (student) => {
  const now = Date.now();
  const windowStart = student?.otp_resend_window_start ? new Date(student.otp_resend_window_start).getTime() : 0;
  const inCurrentWindow = windowStart && now - windowStart < RESEND_WINDOW_MS;
  const resendCount = inCurrentWindow ? Number(student.resend_count || 0) : 0;
  return {
    allowed: resendCount < MAX_RESENDS_PER_HOUR,
    count: resendCount,
    windowStart: inCurrentWindow ? new Date(windowStart).toISOString() : new Date(now).toISOString()
  };
};

const saveOtpAndSend = async (student) => {
  const limit = canSendOtp(student);
  if (!limit.allowed) {
    const error = new Error("Too many verification emails. Try again later.");
    error.status = 429;
    throw error;
  }

  const code = generateOtp();
  const { error } = await supabaseAdmin
    .from("students")
    .update({
      otp_hash: hashOtp(student.email, code),
      otp_expiry: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      resend_count: limit.count + 1,
      otp_resend_window_start: limit.windowStart,
      verification_attempts: 0,
      updated_at: new Date().toISOString()
    })
    .eq("id", student.id);
  if (error) throw error;

  await sendVerificationEmail({ email: student.email, name: student.name, code });
};

const recordPurchase = async ({ studentEmail, courseId, transactionId, method, amount, status = "paid" }) => {
  if (!studentEmail || !courseId) throw new Error("Student email and course id are required.");

  const student = await getStudentByEmail(studentEmail);
  if (!student || !student.email_verified) throw new Error("Verified student account is required.");

  const { data, error } = await supabaseAdmin
    .from("purchases")
    .upsert({
      student_id: student.id,
      course_id: courseId,
      payment_id: transactionId,
      method,
      amount: amount || 0,
      status
    }, { onConflict: "student_id,course_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

app.post("/api/signup", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { name, password, dob, photo, classLevel } = req.body;
    if (!name || !email || !password || !classLevel) {
      return res.status(400).json({ message: "Name, email, password, and class are required." });
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address." });
    if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });

    const existing = await getStudentByEmail(email);
    if (existing?.email_verified) {
      return res.json({ ok: true, message: "If the account can be verified, a code has been sent." });
    }

    let student = existing;
    if (!student) {
      const { data, error } = await supabaseAdmin
        .from("students")
        .insert({
          name: String(name).trim(),
          dob: dob || null,
          email,
          photo: photo || null,
          class_level: classLevel,
          password_hash: hashPassword(password),
          email_verified: false,
          resend_count: 0,
          verification_attempts: 0
        })
        .select()
        .single();
      if (error) throw error;
      student = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("students")
        .update({
          name: String(name).trim(),
          dob: dob || null,
          photo: photo || null,
          class_level: classLevel,
          password_hash: hashPassword(password),
          updated_at: new Date().toISOString()
        })
        .eq("id", student.id)
        .select()
        .single();
      if (error) throw error;
      student = data;
    }

    await saveOtpAndSend(student);
    res.json({ ok: true, message: "If the account can be verified, a code has been sent." });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Could not create account." });
  }
});

app.post("/api/resend-verification", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) return res.status(400).json({ message: "Enter a valid email address." });

    const student = await getStudentByEmail(email);
    if (student && !student.email_verified) await saveOtpAndSend(student);

    res.json({ ok: true, message: "If the account can be verified, a code has been sent." });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || "Could not resend verification code." });
  }
});

app.post("/api/verify-email", async (req, res) => {
  const genericMessage = "Invalid or expired verification code.";
  try {
    const email = normalizeEmail(req.body.email);
    const code = String(req.body.code || "").trim();
    if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: genericMessage });
    }

    const student = await getStudentByEmail(email);
    if (!student || student.email_verified || !student.otp_hash || !student.otp_expiry) {
      return res.status(400).json({ message: genericMessage });
    }
    if (Number(student.verification_attempts || 0) >= MAX_VERIFY_ATTEMPTS) {
      return res.status(429).json({ message: "Too many attempts. Request a new code." });
    }
    if (new Date(student.otp_expiry).getTime() < Date.now()) {
      return res.status(400).json({ message: genericMessage });
    }

    const expected = Buffer.from(student.otp_hash, "hex");
    const candidate = Buffer.from(hashOtp(email, code), "hex");
    const ok = expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);

    if (!ok) {
      await supabaseAdmin
        .from("students")
        .update({
          verification_attempts: Number(student.verification_attempts || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq("id", student.id);
      return res.status(400).json({ message: genericMessage });
    }

    const { data, error } = await supabaseAdmin
      .from("students")
      .update({
        email_verified: true,
        otp_hash: null,
        otp_expiry: null,
        resend_count: 0,
        verification_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq("id", student.id)
      .select()
      .single();
    if (error) throw error;

    res.json({ ok: true, user: await toFrontendUser(data) });
  } catch (err) {
    res.status(500).json({ message: err.message || genericMessage });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const student = await getStudentByEmail(email);
    if (!student || !verifyPassword(password, student.password_hash)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!student.email_verified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    res.json({ ok: true, user: await toFrontendUser(student) });
  } catch (err) {
    res.status(500).json({ message: err.message || "Login failed." });
  }
});

app.post("/api/students/upsert", async (req, res) => {
  try {
    const user = req.body;
    const email = normalizeEmail(user.email);
    if (!isValidEmail(email)) return res.status(400).json({ message: "Email is required." });

    const existing = await getStudentByEmail(email);
    if (!existing || !existing.email_verified) {
      return res.status(403).json({ message: "Verified student account is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("students")
      .update({
        name: user.name || existing.name,
        dob: user.dob || null,
        photo: user.photo || null,
        class_level: user.classLevel || existing.class_level,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ student: await toFrontendUser(data) });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not update student." });
  }
});

app.get("/api/purchases/list", async (req, res) => {
  try {
    const studentKey = String(req.query.student || "");
    if (!studentKey) return res.status(400).json({ message: "Student key is required." });

    const query = studentKey.includes("@")
      ? supabaseAdmin.from("students").select("id,email_verified").eq("email", normalizeEmail(studentKey)).maybeSingle()
      : supabaseAdmin.from("students").select("id,email_verified").eq("id", studentKey).maybeSingle();

    const { data: student, error } = await query;
    if (error || !student || !student.email_verified) return res.json({ purchases: [] });

    const purchases = await loadPurchases(student.id);
    res.json({ purchases });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not load purchases." });
  }
});

app.post("/api/purchases/record", async (req, res) => {
  try {
    const purchase = await recordPurchase(req.body);
    res.json({ purchase });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not record purchase." });
  }
});

app.post("/api/payment-webhook", async (req, res) => {
  try {
    const secret = req.headers["x-powermind-secret"];
    if (secret !== process.env.PAYMENT_WEBHOOK_SECRET) {
      return res.status(401).json({ message: "Invalid webhook secret." });
    }

    const { studentEmail, courseId, paymentId, amount, method = "gateway" } = req.body;
    const purchase = await recordPurchase({
      studentEmail,
      courseId,
      transactionId: paymentId,
      method,
      amount,
      status: "paid"
    });

    res.json({ ok: true, purchase });
  } catch (err) {
    res.status(500).json({ message: err.message || "Webhook failed." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`PowerMind API running on port ${process.env.PORT || 3000}`);
});
