import crypto from 'node:crypto';
import Razorpay from 'razorpay';

let razorpayClient: Razorpay | null = null;

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId) throw new Error('RAZORPAY_KEY_ID is missing.');
  if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET is missing.');

  return {
    keyId,
    keySecret,
    publicKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId
  };
}

export function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;

  const { keyId, keySecret } = getRazorpayConfig();
  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });

  return razorpayClient;
}

export function verifyRazorpayPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const { keySecret } = getRazorpayConfig();
  const expected = crypto.createHmac('sha256', keySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
  if (expected.length !== razorpaySignature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpaySignature));
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('RAZORPAY_WEBHOOK_SECRET is missing.');

  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
