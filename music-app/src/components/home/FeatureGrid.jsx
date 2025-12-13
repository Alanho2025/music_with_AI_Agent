// src/components/home/FeatureGrid.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const FEATURES = [
  {
    title: "Music Library",
    desc: "Search, sort, and play songs with a full player.",
    to: "/music",
    icon: "🎧",
    protected: false,
  },
  {
    title: "Idol Profiles",
    desc: "View idol details, photos, and summaries.",
    to: "/idols",
    icon: "⭐",
    protected: false,
  },
  {
    title: "Albums",
    desc: "Browse album artworks, prices, and stock.",
    to: "/albums",
    icon: "💿",
    protected: false,
  },
  {
    title: "Custom Playlists",
    desc: "Create your own playlists and mixes.",
    to: "/playlists",
    icon: "📻",
    protected: true,        // 需要登入
  },
  {
    title: "Cart & Store",
    desc: "Test album store flows with cart and checkout.",
    to: "/cart",
    icon: "🛒",
    protected: false,
  },
  {
    title: "Personal Dashboard",
    desc: "See your activity and future analytics.",
    to: "/me",
    icon: "📊",
    protected: true,        // 需要登入
  },
];

export default function FeatureGrid() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleClick = (feature) => {
    if (!feature.protected) {
      navigate(feature.to);
      return;
    }

    // protected → 要登入
    if (!isAuthenticated) {
      // 這裡你可以換成 modal 或 toast
      alert("Please log in to access this feature.");
      login(); // Keycloak login
      return;
    }

    navigate(feature.to);
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-200">Explore features</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((f) => (
          <button
            key={f.title}
            onClick={() => handleClick(f)}
            className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-600 hover:bg-slate-900/70 transition flex flex-col gap-2 text-left"
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
                {f.protected && !isAuthenticated ? "Login" : "View"}
              </span>
            </div>

            <p className="text-xs text-slate-400">{f.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
