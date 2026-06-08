'use client';

import { useState } from 'react';
import type { PaymentCartItemInput, PaymentOrderType } from '@/lib/payments/types';

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

type RazorpayCheckoutButtonProps = {
  amount?: number;
  ventureId: string;
  ventureName: string;
  orderType?: PaymentOrderType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  flatNumber?: string;
  address?: string;
  cartItems?: PaymentCartItemInput[];
  notes?: Record<string, unknown>;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  onSuccess?: (data: RazorpayResponse & { localOrderId?: string | null }) => void;
  onFailure?: (message: string) => void;
};

const scriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({
  amount,
  ventureId,
  ventureName,
  orderType = 'CUSTOM_PAYMENT',
  customerName,
  customerPhone,
  customerEmail,
  flatNumber,
  address,
  cartItems,
  notes,
  buttonText = 'Pay online with Razorpay',
  className,
  disabled,
  onSuccess,
  onFailure
}: RazorpayCheckoutButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [message, setMessage] = useState('');

  async function startCheckout() {
    setMessage('');
    setStatus('loading');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) throw new Error('Razorpay Checkout could not load. Please retry.');

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          ventureId,
          ventureName,
          customerName,
          customerPhone,
          customerEmail,
          flatNumber,
          address,
          cartItems,
          notes,
          orderType
        })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || 'Could not create payment order.');

      let paymentCompleted = false;
      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: ventureName,
        description: `${ventureName} payment`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone
        },
        notes: {
          localOrderId: orderData.localOrderId,
          ventureId,
          orderType
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                localOrderId: orderData.localOrderId
              })
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            paymentCompleted = true;
            setStatus('success');
            setMessage('Payment verified successfully.');
            onSuccess?.({ ...response, localOrderId: orderData.localOrderId });
          } catch (error) {
            const failureMessage = error instanceof Error ? error.message : 'Payment verification failed.';
            setStatus('failed');
            setMessage(failureMessage);
            onFailure?.(failureMessage);
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setStatus('idle');
              setMessage('Payment window closed before completion.');
            }
          }
        }
      });

      checkout.on('payment.failed', (response) => {
        const failureMessage =
          typeof response === 'object' && response && 'error' in response
            ? 'Payment failed. Please retry or use WhatsApp support.'
            : 'Payment failed. Please retry.';
        setStatus('failed');
        setMessage(failureMessage);
        onFailure?.(failureMessage);
      });

      checkout.open();
    } catch (error) {
      const failureMessage = error instanceof Error ? error.message : 'Payment failed. Please retry.';
      setStatus('failed');
      setMessage(failureMessage);
      onFailure?.(failureMessage);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={disabled || status === 'loading'}
        className={
          className ||
          'focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-black text-midnight transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {status === 'loading' ? 'Opening secure checkout...' : buttonText}
      </button>
      {message ? (
        <p className={`text-sm font-bold ${status === 'success' ? 'text-emerald-200' : status === 'failed' ? 'text-orange-200' : 'text-slate-300'}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
