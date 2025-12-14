// src/cart/OrderSummaryCard.jsx
import React from 'react';

function OrderSummaryCard({
  totalItems,
  subtotal,
  shipping,
  grandTotal,
  currencyLabel = 'NZD',
  children,
}) {
  return (
    <aside className="w-full lg:w-80 lg:self-start">
      <div className="sticky top-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-50">Order summary</h2>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Items ({totalItems})</span>
          <span className="text-slate-100">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Shipping</span>
          <span className="text-slate-100">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <hr className="border-slate-800" />

        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-slate-100">Total</span>
          <span className="text-slate-50">
            ${grandTotal.toFixed(2)} {currencyLabel}
          </span>
        </div>

        {/* 自訂內容：按鈕 / items list / 提示文字 */}
        {children}
      </div>
    </aside>
  );
}

export default OrderSummaryCard;
