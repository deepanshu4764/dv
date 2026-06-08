import { NextResponse } from 'next/server';
import { markWebhookEventProcessed, updatePaymentByRazorpayOrderId, updatePaymentByRazorpayPaymentId } from '@/lib/payments/store';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RazorpayWebhookPayload = {
  event?: string;
  id?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        error_description?: string;
      };
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
      };
    };
    refund?: {
      entity?: {
        id?: string;
        payment_id?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';

  try {
    if (!signature) {
      return NextResponse.json({ error: 'Missing Razorpay webhook signature.' }, { status: 400 });
    }

    const verified = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!verified) {
      return NextResponse.json({ error: 'Invalid Razorpay webhook signature.' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const payment = payload.payload?.payment?.entity;
    const order = payload.payload?.order?.entity;
    const refund = payload.payload?.refund?.entity;
    const eventId = payload.id || `${payload.event || 'event'}:${payment?.id || order?.id || refund?.id || Date.now()}`;

    if (!markWebhookEventProcessed(eventId)) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (payload.event === 'payment.captured' && payment?.order_id) {
      updatePaymentByRazorpayOrderId(payment.order_id, {
        status: 'SUCCESS',
        razorpayPaymentId: payment.id
      });
    }

    if (payload.event === 'payment.failed' && payment?.order_id) {
      updatePaymentByRazorpayOrderId(payment.order_id, {
        status: 'FAILED',
        razorpayPaymentId: payment.id,
        failureReason: payment.error_description || 'Payment failed'
      });
    }

    if (payload.event === 'order.paid' && order?.id) {
      updatePaymentByRazorpayOrderId(order.id, {
        status: 'SUCCESS'
      });
    }

    if (payload.event === 'refund.processed' && refund?.payment_id) {
      updatePaymentByRazorpayPaymentId(refund.payment_id, {
        status: 'REFUNDED'
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handling failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
