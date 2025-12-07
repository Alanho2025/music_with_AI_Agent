// src/pages/CheckoutPage.jsx
import React, { useState, useMemo } from "react";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import OrderSummaryCard from "../cart/OrderSummaryCard";
import { calculateTotals } from "../cart/pricing";

import CheckoutEmpty from "../checkout/CheckoutEmpty";
import CheckoutSuccess from "../checkout/CheckoutSuccess";
import CheckoutForm from "../checkout/CheckoutForm";

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

    const { shipping, grandTotal } = useMemo(
        () => calculateTotals(totalPrice),
        [totalPrice]
    );

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (
            !form.fullName ||
            !form.email ||
            !form.address1 ||
            !form.city ||
            !form.country
        ) {
            return "Please fill in all required fields (name, email, address, city, country).";
        }

        if (form.paymentMethod === "card" && !form.cardNumber) {
            return "Please enter a mock card number (any digits are fine).";
        }

        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccessId(null);

        const validationMessage = validateForm();
        if (validationMessage) {
            setError(validationMessage);
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

            clearCart();
            setSuccessId(orderId);
        } catch (err) {
            console.error("Failed to save order", err);
            setError("Something went wrong while placing your order.");
        } finally {
            setSubmitting(false);
        }
    };

    // 1. 下單成功
    if (successId) {
        return (
            <CheckoutSuccess
                orderId={successId}
                onBackToAlbums={() => navigate("/albums")}
                onViewCart={() => navigate("/cart")}
            />
        );
    }

    // 2. 購物車為空
    if (!items.length) {
        return <CheckoutEmpty />;
    }

    // 3. 正常 checkout 畫面
    return (
        <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 py-8">
            <CheckoutForm
                form={form}
                error={error}
                submitting={submitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            <OrderSummaryCard
                totalItems={totalItems}
                subtotal={totalPrice}
                shipping={shipping}
                grandTotal={grandTotal}
            >
                <ul className="text-[11px] text-slate-400 space-y-1">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between gap-2"
                        >
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
            </OrderSummaryCard>
        </div>
    );
}

export default CheckoutPage;
