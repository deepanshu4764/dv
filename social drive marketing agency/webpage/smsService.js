const axios = require("axios");

function normalizeIndianPhone(phone) {
  const cleaned = String(phone || "").replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(cleaned)) return `91${cleaned}`;
  if (/^91[6-9]\d{9}$/.test(cleaned)) return cleaned;
  throw smsError("Invalid Indian phone number", 400);
}

function smsError(message, status = 502) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function sendOtpSms(phone, otp) {
  if (process.env.SMS_PROVIDER !== "msg91") {
    console.log(`[DEV OTP] ${phone}: ${otp}`);
    return { success: true, provider: "console" };
  }

  const authkey = process.env.SMS_API_KEY;
  const templateId = process.env.SMS_TEMPLATE_ID;
  if (!authkey) throw smsError("MSG91 auth key missing");
  if (!templateId) throw smsError("MSG91 template ID missing");

  const mobile = normalizeIndianPhone(phone);
  const otpExpiryMinutes = Math.ceil(parseInt(process.env.OTP_TTL_SECONDS || "300", 10) / 60);

  try {
    const response = await axios.get("https://control.msg91.com/api/v5/otp", {
      params: {
        authkey,
        template_id: templateId,
        mobile,
        otp,
        otp_expiry: otpExpiryMinutes
      }
    });

    if (response.data && response.data.type === "error") {
      throw smsError(response.data.message || "MSG91 error");
    }

    return { success: true, provider: "msg91", response: response.data };
  } catch (err) {
    const message =
      (err.response && err.response.data && (err.response.data.message || err.response.data.error)) ||
      err.message ||
      "Failed to send OTP via MSG91";
    if (err.status) throw err;
    throw smsError(message);
  }
}

module.exports = { sendOtpSms };
