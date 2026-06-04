require("dotenv").config({ quiet: true });

const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");
const { sendOtpSms } = require("./smsService");

const scryptAsync = promisify(crypto.scrypt);
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const OTP_TTL_MS = Number(process.env.OTP_TTL_SECONDS || 300) * 1000;
const OTP_RESEND_LIMIT = Number(process.env.OTP_RESEND_LIMIT || 3);
const OTP_ATTEMPT_LIMIT = Number(process.env.OTP_ATTEMPT_LIMIT || 5);
const PASSWORD_TOKEN_TTL_MS = 10 * 60 * 1000;
const LOGIN_WINDOW_MS = Number(process.env.LOGIN_WINDOW_SECONDS || 900) * 1000;
const LOGIN_ATTEMPT_LIMIT = Number(process.env.LOGIN_ATTEMPT_LIMIT || 5);
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS || 604800);
const OTP_SECRET = process.env.OTP_SECRET || crypto.randomBytes(32).toString("hex");

const otpSessions = new Map();
const loginAttempts = new Map();
const sessions = new Map();

function normalizeIndianPhone(input) {
  let digits = String(input || "").replace(/[^\d+]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > 128) {
    return "Password is too long.";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
}

async function ensureDataFile() {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    await fsp.writeFile(USERS_FILE, "[]\n", "utf8");
  }
}

async function readUsers() {
  await ensureDataFile();
  const raw = await fsp.readFile(USERS_FILE, "utf8");
  const users = raw.trim() ? JSON.parse(raw) : [];
  return migrateLegacyUsers(users);
}

async function writeUsers(users) {
  await ensureDataFile();
  const tempFile = `${USERS_FILE}.tmp`;
  await fsp.writeFile(tempFile, `${JSON.stringify(users, null, 2)}\n`, "utf8");
  await fsp.rename(tempFile, USERS_FILE);
}

function migrateLegacyUsers(users) {
  let changed = false;
  const migrated = users.map((user) => {
    const next = { ...user };
    const phone = normalizeIndianPhone(next.phoneNumber || next.phone || next.mobile || next.mobileNumber);

    if (phone && next.phoneNumber !== phone) {
      next.phoneNumber = phone;
      changed = true;
    }
    if (next.email && !next.legacyEmail) {
      next.legacyEmail = next.email;
      delete next.email;
      changed = true;
    }
    if (!next.createdAt) {
      next.createdAt = new Date().toISOString();
      changed = true;
    }
    if (!next.updatedAt) {
      next.updatedAt = next.createdAt;
      changed = true;
    }
    if (typeof next.isPhoneVerified !== "boolean") {
      next.isPhoneVerified = Boolean(next.phoneNumber && next.passwordHash);
      changed = true;
    }

    return next;
  });

  if (changed) writeUsers(migrated).catch((error) => console.error("User migration failed", error));
  return migrated;
}

function findRegisteredUser(users, phoneNumber) {
  return users.find((user) => user.phoneNumber === phoneNumber && user.passwordHash && user.isPhoneVerified);
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith("scrypt$")) return false;
  const [, salt, keyHex] = storedHash.split("$");
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scryptAsync(password, salt, expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function makeOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

function hashOtp(flow, phoneNumber, otp) {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${flow}:${phoneNumber}:${otp}`)
    .digest("hex");
}

function otpKey(flow, phoneNumber) {
  return `${flow}:${phoneNumber}`;
}

async function startOtp(flow, phoneNumber, purpose) {
  const otp = makeOtp();
  const session = {
    otpHash: hashOtp(flow, phoneNumber, otp),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    resendCount: 0,
    verified: false,
    token: null,
    tokenExpiresAt: 0
  };
  otpSessions.set(otpKey(flow, phoneNumber), session);
  await sendOtpSms(phoneNumber, otp);
}

async function resendOtp(flow, phoneNumber, purpose) {
  const key = otpKey(flow, phoneNumber);
  const session = otpSessions.get(key);
  if (!session || session.expiresAt <= Date.now()) {
    await startOtp(flow, phoneNumber, purpose);
    return;
  }
  if (session.resendCount >= OTP_RESEND_LIMIT) {
    const error = new Error("OTP resend limit reached. Please try again later.");
    error.status = 429;
    throw error;
  }

  const otp = makeOtp();
  session.otpHash = hashOtp(flow, phoneNumber, otp);
  session.expiresAt = Date.now() + OTP_TTL_MS;
  session.attempts = 0;
  session.resendCount += 1;
  session.verified = false;
  session.token = null;
  session.tokenExpiresAt = 0;
  await sendOtpSms(phoneNumber, otp);
}

async function sendOrResendOtp(flow, phoneNumber, purpose) {
  const session = otpSessions.get(otpKey(flow, phoneNumber));
  if (session && session.expiresAt > Date.now()) {
    await resendOtp(flow, phoneNumber, purpose);
    return;
  }
  await startOtp(flow, phoneNumber, purpose);
}

function verifyOtp(flow, phoneNumber, otp) {
  const key = otpKey(flow, phoneNumber);
  const session = otpSessions.get(key);
  if (!session || session.expiresAt <= Date.now()) {
    otpSessions.delete(key);
    const error = new Error("OTP expired. Please request a new OTP.");
    error.status = 400;
    throw error;
  }
  if (session.attempts >= OTP_ATTEMPT_LIMIT) {
    otpSessions.delete(key);
    const error = new Error("Too many wrong OTP attempts. Please request a new OTP.");
    error.status = 429;
    throw error;
  }

  session.attempts += 1;
  const actualHash = hashOtp(flow, phoneNumber, String(otp || ""));
  if (actualHash !== session.otpHash) {
    const error = new Error("Wrong OTP. Please try again.");
    error.status = 400;
    throw error;
  }

  session.verified = true;
  session.token = crypto.randomBytes(32).toString("hex");
  session.tokenExpiresAt = Date.now() + PASSWORD_TOKEN_TTL_MS;
  return session.token;
}

function consumeOtpToken(flow, phoneNumber, token) {
  const key = otpKey(flow, phoneNumber);
  const session = otpSessions.get(key);
  const isValid = session && session.verified && session.token === token && session.tokenExpiresAt > Date.now();
  if (!isValid) {
    const error = new Error("OTP verification expired. Please verify OTP again.");
    error.status = 400;
    throw error;
  }
  otpSessions.delete(key);
}

function getIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function checkLoginLimit(req, phoneNumber) {
  const key = `${getIp(req)}:${phoneNumber}`;
  const attempt = loginAttempts.get(key);
  if (!attempt) return;
  if (attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    const error = new Error("Too many login attempts. Please try again later.");
    error.status = 429;
    throw error;
  }
  if (attempt.firstAttemptAt + LOGIN_WINDOW_MS <= Date.now()) {
    loginAttempts.delete(key);
  }
}

function recordLoginFailure(req, phoneNumber) {
  const key = `${getIp(req)}:${phoneNumber}`;
  const current = loginAttempts.get(key);
  const now = Date.now();
  const next = current && current.firstAttemptAt + LOGIN_WINDOW_MS > now
    ? { ...current, count: current.count + 1 }
    : { count: 1, firstAttemptAt: now, lockedUntil: 0 };

  if (next.count >= LOGIN_ATTEMPT_LIMIT) {
    next.lockedUntil = now + LOGIN_WINDOW_MS;
  }
  loginAttempts.set(key, next);
}

function clearLoginFailures(req, phoneNumber) {
  loginAttempts.delete(`${getIp(req)}:${phoneNumber}`);
}

function createSession(res, req, user) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    phoneNumber: user.phoneNumber,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
  });
  setAuthCookie(res, req, token, SESSION_TTL_SECONDS);
}

function getSessionUser(req, users) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.sd_auth;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return findRegisteredUser(users, session.phoneNumber) || null;
}

function parseCookies(header) {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function setAuthCookie(res, req, token, maxAgeSeconds) {
  const isSecure = req.socket.encrypted || req.headers["x-forwarded-proto"] === "https";
  const secureFlag = isSecure ? "; Secure" : "";
  res.setHeader("Set-Cookie", `sd_auth=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${secureFlag}`);
}

function clearAuthCookie(res) {
  res.setHeader("Set-Cookie", "sd_auth=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

function sanitizeUser(user) {
  return {
    phoneNumber: user.phoneNumber,
    isPhoneVerified: Boolean(user.isPhoneVerified),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 1024 * 1024) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      throw error;
    }
  }
  return body ? JSON.parse(body) : {};
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, error) {
  sendJson(res, error.status || 500, {
    message: error.status ? error.message : "Something went wrong. Please try again."
  });
  if (!error.status) console.error(error);
}

async function handleApi(req, res, pathname) {
  try {
    if (req.method === "POST" && pathname === "/api/auth/signup/start") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });

      const users = await readUsers();
      if (findRegisteredUser(users, phoneNumber)) {
        return sendJson(res, 409, { message: "This phone number is already registered. Please login." });
      }

      await sendOrResendOtp("signup", phoneNumber, "signup");
      return sendJson(res, 200, { message: "OTP sent to your phone number.", phoneNumber });
    }

    if (req.method === "POST" && pathname === "/api/auth/signup/verify") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });
      const signupToken = verifyOtp("signup", phoneNumber, body.otp);
      return sendJson(res, 200, { message: "Phone number verified. Create your password.", signupToken });
    }

    if (req.method === "POST" && pathname === "/api/auth/signup/complete") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });

      const passwordError = validatePassword(body.password);
      if (passwordError) return sendJson(res, 400, { message: passwordError });

      const users = await readUsers();
      if (findRegisteredUser(users, phoneNumber)) {
        return sendJson(res, 409, { message: "This phone number is already registered. Please login." });
      }

      consumeOtpToken("signup", phoneNumber, body.signupToken);
      const now = new Date().toISOString();
      const user = {
        phoneNumber,
        passwordHash: await hashPassword(body.password),
        isPhoneVerified: true,
        createdAt: now,
        updatedAt: now
      };
      users.push(user);
      await writeUsers(users);
      createSession(res, req, user);
      return sendJson(res, 201, { message: "Account created successfully.", user: sanitizeUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/login") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.identifier || body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });

      checkLoginLimit(req, phoneNumber);
      const users = await readUsers();
      const user = findRegisteredUser(users, phoneNumber);
      const isValid = user && await verifyPassword(body.password || "", user.passwordHash);
      if (!isValid) {
        recordLoginFailure(req, phoneNumber);
        return sendJson(res, 401, { message: "Wrong phone number or password." });
      }

      clearLoginFailures(req, phoneNumber);
      createSession(res, req, user);
      return sendJson(res, 200, { message: "Login successful.", user: sanitizeUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/forgot/start") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });

      const users = await readUsers();
      if (!findRegisteredUser(users, phoneNumber)) {
        return sendJson(res, 404, { message: "No account found for this phone number." });
      }

      await sendOrResendOtp("reset", phoneNumber, "password reset");
      return sendJson(res, 200, { message: "OTP sent to your registered phone number.", phoneNumber });
    }

    if (req.method === "POST" && pathname === "/api/auth/forgot/verify") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });
      const resetToken = verifyOtp("reset", phoneNumber, body.otp);
      return sendJson(res, 200, { message: "OTP verified. Set your new password.", resetToken });
    }

    if (req.method === "POST" && pathname === "/api/auth/forgot/complete") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });

      const passwordError = validatePassword(body.password);
      if (passwordError) return sendJson(res, 400, { message: passwordError });

      consumeOtpToken("reset", phoneNumber, body.resetToken);
      const users = await readUsers();
      const user = findRegisteredUser(users, phoneNumber);
      if (!user) return sendJson(res, 404, { message: "No account found for this phone number." });

      user.passwordHash = await hashPassword(body.password);
      user.updatedAt = new Date().toISOString();
      await writeUsers(users);
      createSession(res, req, user);
      return sendJson(res, 200, { message: "Password updated successfully.", user: sanitizeUser(user) });
    }

    if (req.method === "POST" && pathname === "/api/auth/otp/resend") {
      const body = await readJson(req);
      const phoneNumber = normalizeIndianPhone(body.phoneNumber);
      const flow = body.flow === "reset" ? "reset" : "signup";
      if (!phoneNumber) return sendJson(res, 400, { message: "Please enter a valid Indian phone number." });
      await resendOtp(flow, phoneNumber, flow === "reset" ? "password reset" : "signup");
      return sendJson(res, 200, { message: "A new OTP has been sent." });
    }

    if (req.method === "GET" && pathname === "/api/auth/me") {
      const users = await readUsers();
      const user = getSessionUser(req, users);
      return sendJson(res, 200, { user: user ? sanitizeUser(user) : null });
    }

    if (req.method === "POST" && pathname === "/api/auth/logout") {
      clearAuthCookie(res);
      return sendJson(res, 200, { message: "Logged out." });
    }

    sendJson(res, 404, { message: "API route not found." });
  } catch (error) {
    sendError(res, error);
  }
}

function serveIndex(res) {
  const htmlPath = path.join(__dirname, "public", "index.html");
  fs.createReadStream(htmlPath)
    .on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Unable to load index.html");
    })
    .pipe(res);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url.pathname);
    return;
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    serveIndex(res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

ensureDataFile()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Social Drive site running at http://localhost:${PORT}`);
      console.log("OTP SMS provider:", process.env.SMS_PROVIDER || "placeholder");
    });
  })
  .catch((error) => {
    console.error("Server failed to start", error);
    process.exit(1);
  });
