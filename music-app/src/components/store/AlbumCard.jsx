// src/components/store/AlbumCard.jsx
import React, { useState } from "react";
import { useCart } from "../../cart/CartContext";

function AlbumCard({ album }) {
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const maxQty =
        typeof album.stock === "number" && album.stock > 0
            ? album.stock
            : 99;

    const decrease = () => {
        setQty((q) => Math.max(1, q - 1));
    };

    const increase = () => {
        setQty((q) => Math.min(maxQty, q + 1));
    };

    const handleChange = (e) => {
        const v = Number(e.target.value);
        if (Number.isNaN(v)) return;
        if (v <= 0) setQty(1);
        else setQty(Math.min(maxQty, v));
    };

    const handleAdd = () => {
        if (!album.stock || album.stock <= 0) return;
        addToCart(album, qty);
    };

    const outOfStock = typeof album.stock === "number" && album.stock <= 0;

    return (
        <div className="relative flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-pink-400/70 transition">
            {/* Add to cart icon top right */}
            <button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock}
                className="absolute top-3 right-3 rounded-full bg-slate-900/80 border border-slate-700 w-9 h-9 flex items-center justify-center text-slate-100 text-sm hover:bg-pink-500 hover:border-pink-400 disabled:opacity-40 disabled:hover:bg-slate-900"
                title={outOfStock ? "Out of stock" : "Add to cart"}
            >
                🛒
            </button>

            {/* Cover */}
            <div className="aspect-square bg-slate-900 overflow-hidden">
                {album.img_url ? (
                    <img
                        src={album.img_url}
                        alt={album.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        No cover
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-3 gap-2">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-[0.12em] truncate">
                        {album.group_name || "Unknown group"}
                    </p>
                    <p className="text-sm font-semibold text-slate-50 truncate">
                        {album.title}
                    </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                        <span className="text-slate-300 font-semibold">
                            {typeof album.price_nzd === "number"
                                ? `$${album.price_nzd.toFixed(2)}`
                                : "Price TBA"}
                        </span>
                        <span
                            className={`text-[11px] ${outOfStock
                                    ? "text-red-400"
                                    : "text-emerald-400"
                                }`}
                        >
                            {outOfStock
                                ? "Out of stock"
                                : `In stock: ${album.stock}`}
                        </span>
                    </div>
                </div>

                {/* Quantity + add button bottom area */}
                <div className="flex items-center justify-between mt-1 gap-2">
                    {/* Qty control */}
                    <div className="flex items-center border border-slate-700 rounded-full overflow-hidden">
                        <button
                            type="button"
                            onClick={decrease}
                            className="w-7 h-7 text-xs text-slate-100 bg-slate-900 hover:bg-slate-800"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min="1"
                            max={maxQty}
                            value={qty}
                            onChange={handleChange}
                            className="w-10 text-center text-xs bg-slate-950 text-slate-100 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={increase}
                            className="w-7 h-7 text-xs text-slate-100 bg-slate-900 hover:bg-slate-800"
                            disabled={qty >= maxQty}
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={outOfStock}
                        className="flex-1 rounded-full bg-pink-500 text-[11px] font-semibold text-white px-3 py-2 text-center hover:bg-pink-400 disabled:opacity-50"
                    >
                        {outOfStock
                            ? "Sold out"
                            : "Add to cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AlbumCard;
