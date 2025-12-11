// src/components/admin/AlbumForm.jsx
import React from "react";

function AlbumForm({ loading, album, saving, status, onChange, onSave, groups = []}) {
    if (loading || !album) {
        return (
            <div className="flex-1">
                <p className="text-xs text-slate-400">Loading album...</p>
            </div>
        );
    }
    const handleGroupChange = (e) => {
        const value = e.target.value === "" ? null : Number(e.target.value);
        onChange("group_id", value);

        // 順便更新 group_name，讓下面那個 readOnly 欄位跟著變
        const selected = groups.find((g) => g.id === value);
        if (selected) {
            onChange("group_name", selected.name);
        } else {
            onChange("group_name", "");
        }
    };
    return (
        <div className="flex-1 space-y-4">
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

                {/* Group ID */}
                <div>
                    <label className="text-xs text-slate-400">Group</label>
                    <select
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.group_id ?? ""}
                        onChange={handleGroupChange}
                    >
                        <option value="">Select a group</option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name} (ID: {g.id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Group name (read only) */}
                <div>
                    <label className="text-xs text-slate-400">Group name</label>
                    <input
                        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-300"
                        value={album.group_name || ""}
                        readOnly
                    />
                </div>

                {/* Release date */}
                <div>
                    <label className="text-xs text-slate-400">Release date</label>
                    <input
                        type="date"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={
                            album.release_date
                                ? album.release_date.slice(0, 10)
                                : ""
                        }
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
                            onChange(
                                "sales",
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                            )
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
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                            )
                        }
                    />
                </div>

                {/* Price (NZD) */}
                <div>
                    <label className="text-xs text-slate-400">Price (NZD)</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-2 rounded-l-lg border border-slate-700 bg-slate-900 text-xs text-slate-300">
                            $
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1 rounded-r-lg bg-slate-950 border border-l-0 border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={album.price_nzd ?? ""}
                            onChange={(e) =>
                                onChange(
                                    "price_nzd",
                                    e.target.value === ""
                                        ? null
                                        : Number(e.target.value)
                                )
                            }
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Base price in New Zealand dollars. Promotions will apply on top of this.
                    </p>
                </div>
                {/* Stock */}
                <div>
                    <label className="text-xs text-slate-400">Stock</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.stock ?? ""}
                        onChange={(e) =>
                            onChange(
                                "stock",
                                e.target.value === "" ? null : Number(e.target.value)
                            )
                        }
                    />
                </div>
                {/* Album cover URL */}
                <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">
                        Album cover URL
                    </label>
                    <input
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={album.img_url || ""}
                        onChange={(e) => onChange("img_url", e.target.value)}
                    />
                </div>
            </div>

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
