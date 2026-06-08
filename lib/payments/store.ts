import type { PaymentStatus, PublicPaymentOrder, StoredPaymentOrder, ValidatedPaymentOrder } from './types';

type PaymentStoreGlobal = typeof globalThis & {
  __deepanshuPayments?: Map<string, StoredPaymentOrder>;
  __deepanshuWebhookEvents?: Set<string>;
};

const globalStore = globalThis as PaymentStoreGlobal;
const payments = globalStore.__deepanshuPayments || new Map<string, StoredPaymentOrder>();
const webhookEvents = globalStore.__deepanshuWebhookEvents || new Set<string>();

globalStore.__deepanshuPayments = payments;
globalStore.__deepanshuWebhookEvents = webhookEvents;

function publicOrder(order: StoredPaymentOrder): PublicPaymentOrder {
  const { razorpaySignature: _signature, ...safeOrder } = order;
  return safeOrder;
}

export function createPaymentAttempt(input: ValidatedPaymentOrder): StoredPaymentOrder {
  const id = `dvpay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const order: StoredPaymentOrder = {
    ...input,
    id,
    receipt: id.slice(0, 40),
    status: 'CREATED',
    createdAt,
    updatedAt: createdAt
  };

  // TODO: Replace this in-memory placeholder with Prisma, Firestore, or another durable database.
  payments.set(id, order);
  return order;
}

export function updatePaymentAttempt(id: string, patch: Partial<StoredPaymentOrder>): StoredPaymentOrder | null {
  const existing = payments.get(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString()
  };
  payments.set(id, updated);
  return updated;
}

export function findPaymentByLocalId(id?: string | null) {
  return id ? payments.get(id) || null : null;
}

export function findPaymentByRazorpayOrderId(razorpayOrderId?: string | null) {
  if (!razorpayOrderId) return null;
  return Array.from(payments.values()).find((order) => order.razorpayOrderId === razorpayOrderId) || null;
}

export function updatePaymentByRazorpayOrderId(razorpayOrderId: string, patch: Partial<StoredPaymentOrder>) {
  const existing = findPaymentByRazorpayOrderId(razorpayOrderId);
  if (!existing) return null;
  return updatePaymentAttempt(existing.id, patch);
}

export function updatePaymentByRazorpayPaymentId(razorpayPaymentId: string, patch: Partial<StoredPaymentOrder>) {
  const existing = Array.from(payments.values()).find((order) => order.razorpayPaymentId === razorpayPaymentId);
  if (!existing) return null;
  return updatePaymentAttempt(existing.id, patch);
}

export function listPaymentAttempts(): PublicPaymentOrder[] {
  return Array.from(payments.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(publicOrder);
}

export function markWebhookEventProcessed(eventId: string) {
  if (webhookEvents.has(eventId)) return false;
  webhookEvents.add(eventId);
  return true;
}

export function coercePaymentStatus(status: unknown): PaymentStatus {
  if (status === 'SUCCESS' || status === 'FAILED' || status === 'REFUNDED' || status === 'ATTEMPTED') return status;
  return 'CREATED';
}
