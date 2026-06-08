import { NextResponse } from 'next/server';
import { listPaymentAttempts } from '@/lib/payments/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // TODO: Protect this endpoint with admin authentication before production payment operations.
  return NextResponse.json({
    payments: listPaymentAttempts()
  });
}
