// src/components/home/FeatureGrid.jsx
import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Music Library",
    desc: "Search, sort, and play songs with a full player.",
    to: "/music",
    icon: "🎧",
  },
  {
    title: "Idol Profiles",
    desc: "View idol details, photos, and summaries.",
    to: "/idols",
    icon: "⭐",
  },
  {
    title: "Albums",
    desc: "Browse album artworks, prices, and stock.",
    to: "/albums",
    icon: "💿",
  },
  {
    title: "Custom Playlists",
    desc: "Create your own playlists and mixes.",
    to: "/playlists",
    icon: "📻",
  },
  {
    title: "Cart & Store",
    desc: "Test album store flows with cart and checkout.",
    to: "/cart",
    icon: "🛒",
  },
  {
    title: "Personal Dashboard",
    desc: "See your activity and future analytics.",
    to: "/dashboard",
    icon: "📊",
  },
];

export default function FeatureGrid() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Explore features</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-600 hover:bg-slate-900/70 transition flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-lg">
                  <span>{f.icon}</span>
                </div>
                <p className="text-sm font-semibold text-slate-50">
                  {f.title}
                </p>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-200">
                View
              </span>
            </div>
            <p className="text-xs text-slate-400">{f.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
