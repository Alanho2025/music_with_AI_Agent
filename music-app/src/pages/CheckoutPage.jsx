// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";

const ORDERS_STORAGE_KEY = "kpophub_orders_v1";

function CheckoutPage() {
    const { items, totalItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        country: "",
        postalCode: "",
        paymentMethod: "card",
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvc: "",
        note: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successId, setSuccessId] = useState(null);

    // 沒有商品就不讓進來
    if (!items.length && !successId) {
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

    const shipping = totalPrice >= 100 ? 0 : 10;
    const grandTotal = totalPrice + shipping;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccessId(null);

        // 超簡單驗證
        if (!form.fullName || !form.email || !form.address1 || !form.city || !form.country) {
            setError("Please fill in all required fields (name, email, address, city, country).");
            return;
        }

        if (form.paymentMethod === "card" && !form.cardNumber) {
            setError("Please enter a mock card number (any digits are fine).");
            return;
        }

        setSubmitting(true);

        try {
            const now = new Date();
            const orderId = `ORD-${now.getTime()}`;

            const order = {
                id: orderId,
                createdAt: now.toISOString(),
                items,
                totals: {
                    totalItems,
                    subtotal: totalPrice,
                    shipping,
                    grandTotal,
                },
                customer: {
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                },
                address: {
                    address1: form.address1,
                    address2: form.address2,
                    city: form.city,
                    country: form.country,
                    postalCode: form.postalCode,
                },
                payment: {
                    method: form.paymentMethod,
                    cardLast4: form.cardNumber
                        ? form.cardNumber.slice(-4)
                        : null,
                },
                note: form.note || null,
            };

            if (typeof window !== "undefined") {
                const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
                const existing = raw ? JSON.parse(raw) : [];
                existing.push(order);
                window.localStorage.setItem(
                    ORDERS_STORAGE_KEY,
                    JSON.stringify(existing)
                );
            }

            clearCart(); // 清空 cart
            setSuccessId(orderId);

            // 也可以直接跳轉到 /cart 或 /orders
            // navigate("/cart", { state: { justOrdered: true } });
        } catch (err) {
            console.error("Failed to save order", err);
            setError("Something went wrong while placing your order.");
        } finally {
            setSubmitting(false);
        }
    };

    // 下單成功的提示畫面
    if (successId) {
        return (
            <div className="px-4 md:px-8 py-10 max-w-2xl">
                <h1 className="text-2xl font-semibold text-slate-50 mb-2">
                    Order placed ✨
                </h1>
                <p className="text-sm text-slate-300 mb-4">
                    Thank you for your order. Your order ID is{" "}
                    <span className="font-mono text-pink-400">{successId}</span>.
                </p>
                <p className="text-xs text-slate-400 mb-6">
                    We saved this order to your browser. You can implement a
                    real backend later to send confirmation emails and track
                    shipping.
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/albums")}
                        className="rounded-full bg-pink-500 text-xs font-semibold text-white px-4 py-2.5 hover:bg-pink-400"
                    >
                        Back to albums
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="rounded-full border border-slate-700 text-xs font-semibold text-slate-100 px-4 py-2.5 hover:bg-slate-900"
                    >
                        View cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8">
            {/* 左邊：表單 */}
            <form
                onSubmit={handleSubmit}
                className="flex-1 space-y-6 max-w-2xl"
            >
                <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-2">
                    Checkout
                </h1>
                <p className="text-xs text-slate-400 mb-4">
                    Enter your shipping details and a mock payment method to
                    place a test order.
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
                                onChange={(e) =>
                                    handleChange("fullName", e.target.value)
                                }
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
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                                Phone
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[11px] text-slate-400 block mb-1">
                                Address line 1 *
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.address1}
                                onChange={(e) =>
                                    handleChange("address1", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[11px] text-slate-400 block mb-1">
                                Address line 2
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.address2}
                                onChange={(e) =>
                                    handleChange("address2", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                                City *
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.city}
                                onChange={(e) =>
                                    handleChange("city", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                                Country *
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.country}
                                onChange={(e) =>
                                    handleChange("country", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-slate-400 block mb-1">
                                Postal code
                            </label>
                            <input
                                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                value={form.postalCode}
                                onChange={(e) =>
                                    handleChange("postalCode", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Payment mock */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-100">
                        Payment (mock)
                    </h2>

                    <div className="flex gap-3 text-[11px]">
                        <button
                            type="button"
                            onClick={() =>
                                handleChange("paymentMethod", "card")
                            }
                            className={`px-3 py-1 rounded-full border ${form.paymentMethod === "card"
                                    ? "bg-slate-100 text-slate-900 border-slate-100"
                                    : "border-slate-600 text-slate-300"
                                }`}
                        >
                            Card
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleChange("paymentMethod", "bank")
                            }
                            className={`px-3 py-1 rounded-full border ${form.paymentMethod === "bank"
                                    ? "bg-slate-100 text-slate-900 border-slate-100"
                                    : "border-slate-600 text-slate-300"
                                }`}
                        >
                            Bank transfer (mock)
                        </button>
                    </div>

                    {form.paymentMethod === "card" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <label className="text-[11px] text-slate-400 block mb-1">
                                    Card number (mock) *
                                </label>
                                <input
                                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                    value={form.cardNumber}
                                    onChange={(e) =>
                                        handleChange(
                                            "cardNumber",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div>
                                <label className="text-[11px] text-slate-400 block mb-1">
                                    Name on card
                                </label>
                                <input
                                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                    value={form.cardName}
                                    onChange={(e) =>
                                        handleChange(
                                            "cardName",
                                            e.target.value
                                        )
                                    }
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
                                        onChange={(e) =>
                                            handleChange(
                                                "cardExpiry",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-[11px] text-slate-400 block mb-1">
                                        CVC
                                    </label>
                                    <input
                                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                                        value={form.cardCvc}
                                        onChange={(e) =>
                                            handleChange(
                                                "cardCvc",
                                                e.target.value
                                            )
                                        }
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
                            onChange={(e) =>
                                handleChange("note", e.target.value)
                            }
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-pink-500 text-xs font-semibold text-white px-5 py-3 hover:bg-pink-400 disabled:opacity-60"
                >
                    {submitting ? "Placing order..." : "Place order"}
                </button>
            </form>

            {/* 右邊：summary（沿用 cart 的邏輯） */}
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

                    <ul className="text-[11px] text-slate-400 space-y-1">
                        {items.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span className="truncate max-w-[150px]">
                                    {item.group_name
                                        ? `${item.group_name} - `
                                        : ""}
                                    {item.title}
                                    {item.quantity > 1
                                        ? ` ×${item.quantity}`
                                        : ""}
                                </span>
                                <span>
                                    $
                                    {(
                                        (item.price_nzd ?? 0) *
                                        item.quantity
                                    ).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default CheckoutPage;
