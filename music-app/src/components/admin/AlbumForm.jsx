// src/components/admin/AlbumForm.jsx
import React from "react";

function AlbumForm({ loading, album, saving, status, onChange, onSave }) {
    if (loading || !album) {
        return (
            <div className="flex-1">
                <p className="text-xs text-slate-400">Loading album...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4">
            {/* 狀態訊息 */}
            {status && (
                <div
                    className={`mb-3 rounded-lg border px-3 py-2 text-xs ${status.type === "success"
                            ? "border-emerald-500 bg-emerald-950 text-emerald-100"
                            : "border-red-500 bg-red-950 text-red-100"
                        }`}
                >
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">Title</label>
                    <input
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.title || ""}
                        onChange={(e) => onChange("title", e.target.value)}
                    />
                </div>

                {/* Group id */}
                <div>
                    <label className="text-xs text-slate-400">Group ID</label>
                    <input
                        type="number"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.group_id || ""}
                        onChange={(e) =>
                            onChange("group_id", Number(e.target.value) || null)
                        }
                    />
                </div>

                {/* Release date */}
                <div>
                    <label className="text-xs text-slate-400">Release date</label>
                    <input
                        type="date"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.release_date ? album.release_date.slice(0, 10) : ""}
                        onChange={(e) => onChange("release_date", e.target.value)}
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="text-xs text-slate-400">Country</label>
                    <input
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.country || ""}
                        onChange={(e) => onChange("country", e.target.value)}
                    />
                </div>

                {/* Sales */}
                <div>
                    <label className="text-xs text-slate-400">Sales</label>
                    <input
                        type="number"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.sales ?? ""}
                        onChange={(e) =>
                            onChange("sales", e.target.value === "" ? null : Number(e.target.value))
                        }
                    />
                </div>

                {/* Peak chart */}
                <div>
                    <label className="text-xs text-slate-400">Peak chart</label>
                    <input
                        type="number"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.peak_chart ?? ""}
                        onChange={(e) =>
                            onChange(
                                "peak_chart",
                                e.target.value === "" ? null : Number(e.target.value)
                            )
                        }
                    />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">Album cover URL</label>
                    <input
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.img_url || ""}
                        onChange={(e) => onChange("img_url", e.target.value)}
                    />
                </div>
            </div>

            {/* Preview */}
            {album.img_url && (
                <div>
                    <p className="text-xs text-slate-400 mb-1">Preview</p>
                    <img
                        src={album.img_url}
                        alt={album.title}
                        className="w-40 h-40 object-cover rounded-lg border border-slate-700"
                    />
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-pink-500 text-white hover:bg-pink-400 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save changes"}
                </button>
            </div>
        </div>
    );
}

export default AlbumForm;
