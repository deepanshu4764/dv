import { NextResponse } from 'next/server';
import { getPaymentPurposeLabel, validatePaymentOrderInput } from '@/lib/payments/catalog';
import { createPaymentAttempt, updatePaymentAttempt } from '@/lib/payments/store';
import type { CreatePaymentOrderInput } from '@/lib/payments/types';
import { getRazorpayClient, getRazorpayConfig } from '@/lib/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CreatePaymentOrderInput;
    const validated = validatePaymentOrderInput(input);
    const localOrder = createPaymentAttempt(validated);
    const razorpay = getRazorpayClient();
    const { publicKeyId } = getRazorpayConfig();

    const razorpayOrder = await razorpay.orders.create({
      amount: validated.amountPaise,
      currency: validated.currency,
      receipt: localOrder.receipt,
      notes: {
        localOrderId: localOrder.id,
        ventureId: validated.ventureId,
        ventureName: validated.ventureName,
        orderType: validated.orderType,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        purpose: getPaymentPurposeLabel(validated.orderType)
      }
    });

    const razorpayOrderId = String(razorpayOrder.id);
    updatePaymentAttempt(localOrder.id, {
      razorpayOrderId,
      status: 'ATTEMPTED'
    });

    return NextResponse.json({
      razorpayOrderId,
      amount: validated.amountPaise,
      amountRupees: validated.amount,
      currency: validated.currency,
      keyId: publicKeyId,
      localOrderId: localOrder.id,
      ventureName: validated.ventureName,
      serverSummary: validated.serverSummary
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create Razorpay order.';
    const status = message.includes('RAZORPAY_') ? 500 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
