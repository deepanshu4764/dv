'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PublicPaymentOrder } from '@/lib/payments/types';

export function PaymentsAdminClient() {
  const [payments, setPayments] = useState<PublicPaymentOrder[]>([]);
  const [status, setStatus] = useState('');
  const [venture, setVenture] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then((response) => response.json())
      .then((data) => setPayments(Array.isArray(data.payments) ? data.payments : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return payments.filter((payment) => {
      const matchesStatus = !status || payment.status === status;
      const matchesVenture = !venture || payment.ventureId === venture;
      const haystack = `${payment.customerName} ${payment.customerPhone} ${payment.ventureName} ${payment.razorpayOrderId || ''} ${payment.razorpayPaymentId || ''}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      return matchesStatus && matchesVenture && matchesQuery;
    });
  }, [payments, query, status, venture]);

  return (
    <section className="container py-28">
      <div className="glass rounded-[2rem] p-6 md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-200">TODO: protect before production</p>
        <h1 className="mt-4 text-4xl font-black text-white">Payments admin</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          This dashboard reads the current placeholder payment adapter. Add admin authentication and a durable database before relying on it
          for production reconciliation.
        </p>
      </div>

      <div className="mt-6 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input className="field" placeholder="Search name, phone, order ID" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="field" value={venture} onChange={(event) => setVenture(event.target.value)}>
          <option value="">All ventures</option>
          <option value="deepanshu-ventures">Deepanshu Ventures</option>
          <option value="ai-automation-agency">AI Automation Agency</option>
          <option value="social-drive-marketing-agency">Social Drive Marketing Agency</option>
          <option value="anytimetiffin">AnyTimeTiffin</option>
        </select>
        <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="CREATED">Created</option>
          <option value="ATTEMPTED">Attempted</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Venture</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Failure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {loading ? (
                <tr>
                  <td className="p-4" colSpan={10}>
                    Loading payments...
                  </td>
                </tr>
              ) : null}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td className="p-4" colSpan={10}>
                    No payment attempts found in the current server instance.
                  </td>
                </tr>
              ) : null}
              {filtered.map((payment) => (
                <tr key={payment.id}>
                  <td className="p-4 font-black text-white">{payment.status}</td>
                  <td className="p-4">{payment.ventureName}</td>
                  <td className="p-4">{payment.customerName}</td>
                  <td className="p-4">{payment.customerPhone}</td>
                  <td className="p-4">Rs. {payment.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4">{payment.razorpayPaymentId || '-'}</td>
                  <td className="p-4">{payment.razorpayOrderId || '-'}</td>
                  <td className="p-4">{payment.orderType}</td>
                  <td className="p-4">{new Date(payment.createdAt).toLocaleString()}</td>
                  <td className="p-4">{payment.failureReason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
