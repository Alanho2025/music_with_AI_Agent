// src/pages/CartPage.jsx
import React, { useMemo } from "react";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
        useCart();
    const navigate = useNavigate();

    const shipping = useMemo(() => {
        if (totalPrice === 0) return 0;
        // 先簡單：滿 100 免運，不滿 100 運費 10
        return totalPrice >= 100 ? 0 : 10;
    }, [totalPrice]);

    const grandTotal = totalPrice + shipping;

    const handleQtyChange = (item, next) => {
        const maxStock =
            typeof item.stock === "number" && item.stock > 0
                ? item.stock
                : 999;
        if (next < 1) next = 1;
        if (next > maxStock) next = maxStock;
        updateQuantity(item.id, next);
    };

    if (!items.length) {
        return (
            <div className="px-4 md:px-8 py-8">
                <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
                    Shopping cart
                </h1>
                <p className="text-xs text-slate-400">
                    Your cart is empty. Go to the Albums page to add some K-pop.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8">
            {/* Left: items list */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
                        Shopping cart
                    </h1>
                    <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-4"
                    >
                        Clear cart
                    </button>
                </div>

                <div className="space-y-4">
                    {items.map((item) => {
                        const outOfStock =
                            typeof item.stock === "number" && item.stock <= 0;
                        const itemTotal =
                            (item.price_nzd ?? 0) * item.quantity;

                        return (
                            <div
                                key={item.id}
                                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-3 md:p-4"
                            >
                                {/* cover */}
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                                    {item.img_url ? (
                                        <img
                                            src={item.img_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-500">
                                            No cover
                                        </div>
                                    )}
                                </div>

                                {/* main info */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                                                {item.group_name ||
                                                    "Unknown group"}
                                            </p>
                                            <p className="text-sm md:text-base font-semibold text-slate-50">
                                                {item.title}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-[11px] text-slate-500 hover:text-slate-200"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        {/* price + stock */}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-100">
                                                {typeof item.price_nzd ===
                                                    "number"
                                                    ? `$${item.price_nzd.toFixed(
                                                        2
                                                    )}`
                                                    : "Price TBA"}
                                            </span>
                                            {typeof item.stock === "number" && (
                                                <span
                                                    className={`text-[11px] ${outOfStock
                                                            ? "text-red-400"
                                                            : "text-emerald-400"
                                                        }`}
                                                >
                                                    {outOfStock
                                                        ? "Out of stock"
                                                        : `In stock: ${item.stock}`}
                                                </span>
                                            )}
                                        </div>

                                        {/* qty control */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center border border-slate-700 rounded-full overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQtyChange(
                                                            item,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-7 h-7 text-xs text-slate-100 bg-slate-900 hover:bg-slate-800"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-10 md:w-12 text-center text-xs bg-slate-950 text-slate-100 focus:outline-none"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleQtyChange(
                                                            item,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQtyChange(
                                                            item,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-7 h-7 text-xs text-slate-100 bg-slate-900 hover:bg-slate-800"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* line total */}
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400">
                                                Subtotal
                                            </p>
                                            <p className="text-sm font-semibold text-slate-50">
                                                $
                                                {itemTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right: summary */}
            <aside className="w-full lg:w-80 lg:self-start">
                <div className="sticky top-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
                    <h2 className="text-sm font-semibold text-slate-50">
                        Order summary
                    </h2>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                            Items ({totalItems})
                        </span>
                        <span className="text-slate-100">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Shipping</span>
                        <span className="text-slate-100">
                            {shipping === 0
                                ? "Free"
                                : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>

                    <hr className="border-slate-800" />

                    <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-slate-100">Total</span>
                        <span className="text-slate-50">
                            ${grandTotal.toFixed(2)} NZD
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="w-full rounded-full bg-pink-500 text-xs font-semibold text-white py-2.5 hover:bg-pink-400"
                    >
                        Proceed to checkout
                    </button>


                    <button
                        type="button"
                        className="w-full rounded-full border border-slate-700 text-xs font-semibold text-slate-100 py-2 hover:bg-slate-900"
                    >
                        Continue shopping
                    </button>

                    <p className="text-[10px] text-slate-500">
                        Prices are shown in NZD. Taxes and final shipping cost
                        will be calculated at checkout.
                    </p>
                </div>
            </aside>
        </div>
    );
}

export default CartPage;
