// src/checkout/CheckoutSuccess.jsx
import React from 'react';

function CheckoutSuccess({ orderId, onBackToAlbums, onViewCart }) {
  return (
    <div className="px-4 md:px-8 py-10 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-50 mb-2">
        Order placed ✨
      </h1>
      <p className="text-sm text-slate-300 mb-4">
        Thank you for your order. Your order ID is{' '}
        <span className="font-mono text-pink-400">{orderId}</span>.
      </p>
      <p className="text-xs text-slate-400 mb-6">
        We saved this order to your browser. You can implement a real backend
        later to send confirmation emails and track shipping.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBackToAlbums}
          className="rounded-full bg-pink-500 text-xs font-semibold text-white px-4 py-2.5 hover:bg-pink-400"
        >
          Back to albums
        </button>
        <button
          type="button"
          onClick={onViewCart}
          className="rounded-full border border-slate-700 text-xs font-semibold text-slate-100 px-4 py-2.5 hover:bg-slate-900"
        >
          View cart
        </button>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
