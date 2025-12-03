// src/components/admin/videos/VideoFormPanel.jsx
import React from "react";

function VideoFormPanel({
    groups,
    youtubeUrl,
    setYoutubeUrl,
    loadingMeta,
    onFetchMeta,
    form,
    onChange,
    onSubmit,
    saving,
    selectedVideoId,
    onCancel,
    error,
    message,
}) {
    return (
        <div className="flex flex-col gap-4">
            {/* YouTube URL */}
            <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400">YouTube URL or ID</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <button
                        type="button"
                        onClick={onFetchMeta}
                        disabled={!youtubeUrl || loadingMeta}
                        className="px-4 py-2 rounded-md bg-emerald-500 text-xs font-semibold disabled:opacity-50"
                    >
                        {loadingMeta ? "Loading..." : "Fetch"}
                    </button>
                </div>
            </div>

            {/* form */}
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={onSubmit}
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-slate-400">Group</label>
                        <select
                            value={form.group_id}
                            onChange={(e) => onChange("group_id", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        >
                            <option value="">(None)</option>
                            {groups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => onChange("title", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">YouTube ID</label>
                        <input
                            type="text"
                            value={form.youtube_id}
                            onChange={(e) => onChange("youtube_id", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">Category</label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) => onChange("category", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            placeholder="MV, performance, dance practice, OST..."
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={form.tags}
                            onChange={(e) => onChange("tags", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            placeholder="kpop, le sserafim, performance..."
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">Publish date</label>
                        <input
                            type="date"
                            value={form.publish_date}
                            onChange={(e) => onChange("publish_date", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-slate-400">Thumbnail URL</label>
                        <input
                            type="text"
                            value={form.thumbnail_url}
                            onChange={(e) => onChange("thumbnail_url", e.target.value)}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-xs text-slate-400">Mood</label>
                            <input
                                type="text"
                                value={form.mood}
                                onChange={(e) => onChange("mood", e.target.value)}
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                placeholder="dark, cute..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Style</label>
                            <input
                                type="text"
                                value={form.style}
                                onChange={(e) => onChange("style", e.target.value)}
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                placeholder="MV, dance..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Era</label>
                            <input
                                type="text"
                                value={form.era}
                                onChange={(e) => onChange("era", e.target.value)}
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                placeholder="FEARLESS, EASY..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="text-xs text-slate-400">Duration (sec)</label>
                            <input
                                type="number"
                                value={form.duration_seconds}
                                onChange={(e) =>
                                    onChange("duration_seconds", e.target.value)
                                }
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Views</label>
                            <input
                                type="number"
                                value={form.views}
                                onChange={(e) => onChange("views", e.target.value)}
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Likes</label>
                            <input
                                type="number"
                                value={form.likes}
                                onChange={(e) => onChange("likes", e.target.value)}
                                className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => onChange("description", e.target.value)}
                            rows={6}
                            className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm resize-y"
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving || !form.youtube_id || !form.title}
                                className="px-4 py-2 rounded-md bg-emerald-500 text-xs font-semibold disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : selectedVideoId
                                        ? "Update video"
                                        : "Save video"}
                            </button>

                            {selectedVideoId && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-3 py-2 rounded-md bg-slate-800 text-xs"
                                >
                                    Cancel edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            {message && (
                <p className="text-sm text-emerald-400 mt-2">{message}</p>
            )}
        </div>
    );
}

export default VideoFormPanel;
