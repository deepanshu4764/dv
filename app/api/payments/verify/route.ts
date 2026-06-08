import { NextResponse } from 'next/server';
import { findPaymentByLocalId, findPaymentByRazorpayOrderId, updatePaymentAttempt } from '@/lib/payments/store';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type VerifyPayload = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  localOrderId?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as VerifyPayload;
    const razorpayOrderId = String(payload.razorpay_order_id || '');
    const razorpayPaymentId = String(payload.razorpay_payment_id || '');
    const razorpaySignature = String(payload.razorpay_signature || '');

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: 'Missing Razorpay verification fields.' }, { status: 400 });
    }

    const isValid = verifyRazorpayPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    const existing = findPaymentByLocalId(payload.localOrderId || null) || findPaymentByRazorpayOrderId(razorpayOrderId);

    if (!isValid) {
      if (existing) {
        updatePaymentAttempt(existing.id, {
          status: 'FAILED',
          razorpayOrderId,
          razorpayPaymentId,
          failureReason: 'Signature verification failed'
        });
      }
      return NextResponse.json({ success: false, error: 'Payment signature verification failed.' }, { status: 400 });
    }

    const updated = existing
      ? updatePaymentAttempt(existing.id, {
          status: 'SUCCESS',
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature
        })
      : null;

    return NextResponse.json({
      success: true,
      localOrderId: updated?.id || payload.localOrderId || null,
      razorpayOrderId,
      razorpayPaymentId
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to verify payment.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
