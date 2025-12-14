// src/cart/pricing.js
export const SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 10;

/**
 * 計算運費：滿 SHIPPING_THRESHOLD 免運，否則固定 SHIPPING_FEE
 */
export function calculateShipping(subtotal) {
  if (!subtotal || subtotal <= 0) return 0;
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/**
 * 回傳 { shipping, grandTotal }
 */
export function calculateTotals(subtotal) {
  const shipping = calculateShipping(subtotal);
  return {
    shipping,
    grandTotal: subtotal + shipping,
  };
}
