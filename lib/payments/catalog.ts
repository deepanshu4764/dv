import type { CreatePaymentOrderInput, PaymentCartItemInput, PaymentOrderType, ValidatedPaymentOrder } from './types';

const INR_MIN_AMOUNT = 1;
const INR_MAX_AMOUNT = 500000;

export const paymentVentures = {
  'deepanshu-ventures': {
    name: 'Deepanshu Ventures',
    allowedOrderTypes: ['AGENCY_SERVICE', 'CUSTOM_PAYMENT'] satisfies PaymentOrderType[]
  },
  'ai-automation-agency': {
    name: 'AI Automation Agency',
    allowedOrderTypes: ['AGENCY_SERVICE', 'SUBSCRIPTION', 'CUSTOM_PAYMENT'] satisfies PaymentOrderType[]
  },
  'social-drive-marketing-agency': {
    name: 'Social Drive Marketing Agency',
    allowedOrderTypes: ['AGENCY_SERVICE', 'SUBSCRIPTION', 'CUSTOM_PAYMENT'] satisfies PaymentOrderType[]
  },
  anytimetiffin: {
    name: 'AnyTimeTiffin',
    allowedOrderTypes: ['TIFFIN_ORDER', 'SUBSCRIPTION', 'CUSTOM_PAYMENT'] satisfies PaymentOrderType[]
  }
} as const;

const anytimeTiffinMenu: Record<string, { title: string; price: number }> = {
  standard: { title: 'Standard Home Tiffin', price: 129 },
  premium: { title: 'Premium Home Tiffin', price: 169 },
  plain_roti: { title: 'Plain Roti', price: 7 },
  butter_roti: { title: 'Butter Roti', price: 9 },
  dal: { title: 'Dal', price: 30 },
  veg_sabzi: { title: 'Veg Sabzi', price: 40 },
  paneer_sabzi: { title: 'Paneer Sabzi', price: 70 },
  rice: { title: 'Rice', price: 23 }
};

const anytimeTiffinCoupons: Record<string, { discount: number; min: number }> = {
  MOMLOVE: { discount: 20, min: 100 },
  TIFFIN50: { discount: 50, min: 300 }
};

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeCurrency(currency?: string) {
  return (currency || 'INR').trim().toUpperCase();
}

function normalizeAmount(amount: unknown) {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error('A valid amount is required.');
  }

  const rounded = Math.round(value * 100) / 100;
  if (rounded < INR_MIN_AMOUNT) {
    throw new Error(`Minimum payment amount is Rs. ${INR_MIN_AMOUNT}.`);
  }
  if (rounded > INR_MAX_AMOUNT) {
    throw new Error(`Maximum payment amount is Rs. ${INR_MAX_AMOUNT}.`);
  }

  return rounded;
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, '').replace(/^\+91/, '');
}

function validateCustomer(input: CreatePaymentOrderInput) {
  const customerName = toStringValue(input.customerName);
  const customerPhone = normalizePhone(toStringValue(input.customerPhone));

  if (!customerName) throw new Error('Customer name is required.');
  if (!/^[0-9]{10}$/.test(customerPhone)) throw new Error('A valid 10-digit customer phone number is required.');

  return {
    customerName,
    customerPhone,
    customerEmail: toStringValue(input.customerEmail) || undefined,
    flatNumber: toStringValue(input.flatNumber) || undefined,
    address: toStringValue(input.address) || undefined
  };
}

function validateVenture(input: CreatePaymentOrderInput) {
  const ventureId = toStringValue(input.ventureId);
  const venture = paymentVentures[ventureId as keyof typeof paymentVentures];
  if (!venture) throw new Error('Unknown venture selected for payment.');

  const orderType = input.orderType || 'CUSTOM_PAYMENT';
  if (!(venture.allowedOrderTypes as readonly PaymentOrderType[]).includes(orderType)) {
    throw new Error(`${orderType} is not supported for ${venture.name}.`);
  }

  return {
    ventureId,
    ventureName: venture.name,
    orderType
  };
}

function calculateAnytimeTiffinAmount(cartItems: PaymentCartItemInput[] = [], notes: Record<string, unknown>) {
  if (!cartItems.length) throw new Error('AnyTimeTiffin cart cannot be empty.');

  const normalizedCart = cartItems.map((item) => {
    const key = toStringValue(item.key);
    const catalogItem = anytimeTiffinMenu[key];
    if (!catalogItem) throw new Error(`Unknown AnyTimeTiffin menu item: ${key}`);

    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 25) {
      throw new Error(`Invalid quantity for ${catalogItem.title}.`);
    }

    return {
      key,
      qty,
      title: catalogItem.title,
      price: catalogItem.price
    };
  });

  const subtotal = normalizedCart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const couponCode = toStringValue(notes.couponCode || notes.coupon).toUpperCase();
  const coupon = couponCode ? anytimeTiffinCoupons[couponCode] : undefined;
  const discount = coupon && subtotal >= coupon.min ? Math.min(coupon.discount, subtotal) : 0;
  const amount = normalizeAmount(Math.max(0, subtotal - discount));

  return {
    amount,
    cartItems: normalizedCart,
    serverSummary: {
      subtotal,
      discount,
      couponCode: couponCode || undefined,
      validationSource: 'AnyTimeTiffin server menu catalog'
    }
  };
}

export function validatePaymentOrderInput(input: CreatePaymentOrderInput): ValidatedPaymentOrder {
  const venture = validateVenture(input);
  const customer = validateCustomer(input);
  const currency = normalizeCurrency(input.currency);
  if (currency !== 'INR') throw new Error('Only INR payments are supported right now.');

  const notes = typeof input.notes === 'object' && input.notes && !Array.isArray(input.notes) ? input.notes : {};
  let amount = 0;
  let cartItems: PaymentCartItemInput[] = [];
  let serverSummary: ValidatedPaymentOrder['serverSummary'] = { validationSource: 'Server amount bounds' };

  if (venture.ventureId === 'anytimetiffin' && venture.orderType === 'TIFFIN_ORDER') {
    const tiffin = calculateAnytimeTiffinAmount(input.cartItems, notes as Record<string, unknown>);
    amount = tiffin.amount;
    cartItems = tiffin.cartItems;
    serverSummary = tiffin.serverSummary;
  } else {
    amount = normalizeAmount(input.amount);
    cartItems = Array.isArray(input.cartItems) ? input.cartItems.slice(0, 50) : [];
  }

  return {
    ...venture,
    ...customer,
    amount,
    amountPaise: Math.round(amount * 100),
    currency,
    cartItems,
    notes: notes as Record<string, unknown>,
    serverSummary
  };
}

export function getPaymentPurposeLabel(orderType: PaymentOrderType) {
  if (orderType === 'TIFFIN_ORDER') return 'Tiffin order';
  if (orderType === 'AGENCY_SERVICE') return 'Agency service payment';
  if (orderType === 'SUBSCRIPTION') return 'Subscription payment';
  return 'Custom payment';
}
