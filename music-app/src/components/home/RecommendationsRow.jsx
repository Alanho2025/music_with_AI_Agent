// src/components/home/RecommendationsRow.jsx
import React from "react";
import { Link } from "react-router-dom";
import SkeletonCardRow from "./SkeletonCardRow";

export default function RecommendationsRow({
    title,
    type,
    items,
    loading,
    layout = "scroll", // "scroll" | "grid"
}) {
    if (loading) return <SkeletonCardRow />;

    if (!items || items.length === 0) return null;

    const isGrid = layout === "grid";

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-200">{title}</h2>
            </div>

            <div
                className={
                    isGrid
                        ? "grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
                        : "flex gap-3 overflow-x-auto pb-1"
                }
            >
                {items.map((item) => {
                    const coverUrl =
                        item.thumbnail_url ||
                        item.cover_url ||
                        item.img_url;

                    const cardClass = isGrid
                        ? "group rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-600 hover:bg-slate-900/80 transition flex flex-col gap-2"
                        : "group w-40 shrink-0 rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-slate-600 hover:bg-slate-900/80 transition flex flex-col gap-2";

                    return (
                        <Link
                            key={item.id}
                            to={
                                type === "video"
                                    ? `/videos/${item.id}`
                                    : `/albums/${item.id}`
                            }
                            className={cardClass}
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900">
                                {coverUrl ? (
                                    <img
                                        src={coverUrl}
                                        alt={item.title || item.name}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl">
                                        {type === "video" ? "🎬" : "💿"}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-semibold text-slate-50 truncate">
                                {item.title || item.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                                {item.group_name || item.channel || item.artist}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
