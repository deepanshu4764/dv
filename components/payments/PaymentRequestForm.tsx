'use client';

import { useMemo, useState } from 'react';
import { RazorpayCheckoutButton } from './RazorpayCheckoutButton';

type PaymentRequestFormProps = {
  initialVenture?: string;
  initialAmount?: string;
  initialPurpose?: string;
};

const ventureOptions = [
  { id: 'deepanshu-ventures', name: 'Deepanshu Ventures', orderType: 'CUSTOM_PAYMENT' },
  { id: 'ai-automation-agency', name: 'AI Automation Agency', orderType: 'AGENCY_SERVICE' },
  { id: 'social-drive-marketing-agency', name: 'Social Drive Marketing Agency', orderType: 'AGENCY_SERVICE' },
  { id: 'anytimetiffin', name: 'AnyTimeTiffin', orderType: 'CUSTOM_PAYMENT' }
] as const;

export function PaymentRequestForm({ initialVenture, initialAmount, initialPurpose }: PaymentRequestFormProps) {
  const [ventureId, setVentureId] = useState(initialVenture || 'deepanshu-ventures');
  const [amount, setAmount] = useState(initialAmount || '');
  const [purpose, setPurpose] = useState(initialPurpose || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const selectedVenture = useMemo(() => ventureOptions.find((venture) => venture.id === ventureId) || ventureOptions[0], [ventureId]);
  const amountNumber = Number(amount);
  const isValid = Boolean(customerName.trim() && /^[0-9]{10}$/.test(customerPhone.trim()) && amountNumber >= 1);

  return (
    <div className="card rounded-[2rem] p-6 md:p-8">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Venture
          <select className="field" value={ventureId} onChange={(event) => setVentureId(event.target.value)}>
            {ventureOptions.map((venture) => (
              <option key={venture.id} value={venture.id}>
                {venture.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Customer name
            <input className="field" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Phone number
            <input
              className="field"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Email optional
            <input className="field" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="you@example.com" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-300">
            Amount INR
            <input className="field" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="499" inputMode="decimal" />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-300">
          Purpose / notes
          <textarea
            className="field min-h-28 resize-y"
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            placeholder="Consultation booking, advance payment, custom invoice, monthly tiffin, etc."
          />
        </label>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
          <strong className="text-white">Payment summary:</strong> {selectedVenture.name} · Rs. {amountNumber > 0 ? amountNumber.toLocaleString('en-IN') : '0'}
        </div>

        <RazorpayCheckoutButton
          amount={amountNumber}
          ventureId={selectedVenture.id}
          ventureName={selectedVenture.name}
          orderType={selectedVenture.orderType}
          customerName={customerName}
          customerPhone={customerPhone}
          customerEmail={customerEmail || undefined}
          notes={{ purpose }}
          buttonText="Pay now securely"
          disabled={!isValid}
        />

        {!isValid ? <p className="text-sm font-bold text-slate-400">Enter customer name, valid phone number, and amount to enable payment.</p> : null}
      </div>
    </div>
  );
}
