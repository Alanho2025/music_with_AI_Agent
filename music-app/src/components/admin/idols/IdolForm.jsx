// src/components/admin/IdolForm.jsx
import React from "react";

function IdolForm({
    loading,
    form,
    saving,
    status,
    onIdolChange,
    onImageChange,
    onAddImage,
    onRemoveImage,
    onSave,
}) {
    if (loading || !form) {
        return (
            <div className="flex-1">
                <p className="text-xs text-slate-400">Loading idol...</p>
            </div>
        );
    }

    const { idol, images = [] } = form;

    return (
        <div className="flex-1">
            <div className="flex-1">
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
            </div>
            <div className="space-y-4">
                {/* 基本欄位 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stage name */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Stage name
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.stage_name || ""}
                            onChange={(e) =>
                                onIdolChange("stage_name", e.target.value)
                            }
                        />
                    </div>

                    {/* Birth name */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Birth name
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.birth_name || ""}
                            onChange={(e) =>
                                onIdolChange("birth_name", e.target.value)
                            }
                        />
                    </div>

                    {/* Korean name */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Korean name
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.korean_name || ""}
                            onChange={(e) =>
                                onIdolChange("korean_name", e.target.value)
                            }
                        />
                    </div>

                    {/* Position */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Position
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.position || ""}
                            onChange={(e) =>
                                onIdolChange("position", e.target.value)
                            }
                        />
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Birthdate
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={
                                idol.birthdate
                                    ? idol.birthdate.slice(0, 10)
                                    : ""
                            }
                            onChange={(e) =>
                                onIdolChange("birthdate", e.target.value)
                            }
                        />
                    </div>

                    {/* Nationality */}
                    <div>
                        <label className="text-xs text-slate-400">
                            Nationality
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.nationality || ""}
                            onChange={(e) =>
                                onIdolChange("nationality", e.target.value)
                            }
                        />
                    </div>

                    {/* Main image URL */}
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-400">
                            Main image URL (header)
                        </label>
                        <input
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                            value={idol.image_url || ""}
                            onChange={(e) =>
                                onIdolChange("image_url", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <label className="text-xs text-slate-400">Summary</label>
                    <textarea
                        rows={5}
                        className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-100"
                        value={idol.summary || ""}
                        onChange={(e) =>
                            onIdolChange("summary", e.target.value)
                        }
                    />
                </div>

                {/* Gallery images */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-200">
                            Gallery images
                        </p>
                        <button
                            onClick={onAddImage}
                            className="px-2 py-1 rounded-full text-[11px] bg-slate-800 text-slate-100 hover:bg-slate-700"
                        >
                            + Add image
                        </button>
                    </div>

                    {images.map((img, idx) => (
                        <div key={img.id ?? idx} className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 w-5">
                                {idx + 1}.
                            </span>
                            <input
                                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-1.5 text-[11px] text-slate-100"
                                placeholder="Image URL"
                                value={img.image_url || ""}
                                onChange={(e) =>
                                    onImageChange(idx, "image_url", e.target.value)
                                }
                            />
                            <input
                                type="number"
                                className="w-16 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1.5 text-[11px] text-slate-100"
                                value={img.sort_order || idx + 1}
                                onChange={(e) =>
                                    onImageChange(
                                        idx,
                                        "sort_order",
                                        Number(e.target.value)
                                    )
                                }
                            />
                            <button
                                onClick={() => onRemoveImage(idx)}
                                className="text-[11px] text-red-400 hover:text-red-300"
                            >
                                Delete
                            </button>
                        </div>
                    ))}

                    {images.length === 0 && (
                        <p className="text-[11px] text-slate-500">
                            No gallery images yet.
                        </p>
                    )}
                </div>

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
        </div>
    );
}

export default IdolForm;
