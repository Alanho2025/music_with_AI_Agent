// src/checkout/CheckoutForm.jsx
import React from 'react';

function CheckoutForm({ form, error, submitting, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex-1 space-y-6 max-w-2xl">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
        Checkout
      </h1>
      <p className="text-xs text-slate-400 mb-4">
        Enter your shipping details and a mock payment method to place a test
        order.
      </p>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-950 px-3 py-2 text-xs text-red-100">
          {error}
        </div>
      )}

      {/* Shipping info */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Shipping information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">
              Full name *
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Email *
            </label>
            <input
              type="email"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Phone
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">
              Address line 1 *
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.address1}
              onChange={(e) => onChange('address1', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">
              Address line 2
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.address2}
              onChange={(e) => onChange('address2', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              City *
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Country *
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.country}
              onChange={(e) => onChange('country', e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Postal code
            </label>
            <input
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
              value={form.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payment mock */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-100">Payment (mock)</h2>

        <div className="flex gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => onChange('paymentMethod', 'card')}
            className={`px-3 py-1 rounded-full border ${
              form.paymentMethod === 'card'
                ? 'bg-slate-100 text-slate-900 border-slate-100'
                : 'border-slate-600 text-slate-300'
            }`}
          >
            Card
          </button>
          <button
            type="button"
            onClick={() => onChange('paymentMethod', 'bank')}
            className={`px-3 py-1 rounded-full border ${
              form.paymentMethod === 'bank'
                ? 'bg-slate-100 text-slate-900 border-slate-100'
                : 'border-slate-600 text-slate-300'
            }`}
          >
            Bank transfer (mock)
          </button>
        </div>

        {form.paymentMethod === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[11px] text-slate-400 block mb-1">
                Card number (mock) *
              </label>
              <input
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                value={form.cardNumber}
                onChange={(e) => onChange('cardNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Name on card
              </label>
              <input
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                value={form.cardName}
                onChange={(e) => onChange('cardName', e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                  value={form.cardExpiry}
                  onChange={(e) => onChange('cardExpiry', e.target.value)}
                />
              </div>
              <div className="w-24">
                <label className="text-[11px] text-slate-400 block mb-1">
                  CVC
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                  value={form.cardCvc}
                  onChange={(e) => onChange('cardCvc', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-[11px] text-slate-400 block mb-1">
            Note (optional)
          </label>
          <textarea
            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100 min-h-[64px]"
            value={form.note}
            onChange={(e) => onChange('note', e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-pink-500 text-xs font-semibold text-white px-5 py-3 hover:bg-pink-400 disabled:opacity-60"
      >
        {submitting ? 'Placing order...' : 'Place order'}
      </button>
    </form>
  );
}

export default CheckoutForm;
