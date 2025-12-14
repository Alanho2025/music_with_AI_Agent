// src/checkout/CheckoutEmpty.jsx
import React from 'react';

function CheckoutEmpty() {
  return (
    <div className="px-4 md:px-8 py-8">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
        Checkout
      </h1>
      <p className="text-xs text-slate-400">
        Your cart is empty. Add some albums first.
      </p>
    </div>
  );
}

export default CheckoutEmpty;
