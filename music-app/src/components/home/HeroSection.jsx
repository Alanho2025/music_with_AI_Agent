// src/components/home/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection({ displayName }) {
    return (
        <section className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-600/20 via-purple-500/10 to-sky-500/20 border border-slate-800 px-6 py-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                K-pop Music Hub
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
                Welcome back{displayName ? `, ${displayName}` : ""}.
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
                Play your favorite tracks, browse idols, and manage your own K-pop
                database in one place.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
                <Link
                    to="/music"
                    className="inline-flex items-center rounded-full bg-fuchsia-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-fuchsia-400 transition"
                >
                    Open Music Player
                </Link>
                <Link
                    to="/idols"
                    className="inline-flex items-center rounded-full border border-slate-600 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-400 transition"
                >
                    Browse Idols
                </Link>
            </div>
        </section>
    );
}
