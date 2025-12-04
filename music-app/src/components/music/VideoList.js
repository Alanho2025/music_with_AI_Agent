// src/components/music/VideoList.js
import React from "react";

// 和 MusicPlayer 一樣的 group 取得邏輯
function getGroupName(video) {
    if (!video) return "";
    return (
        video.group_name ||
        video.group ||
        video.groupName ||
        video.artist ||
        ""
    ).trim();
}

function VideoList({
    videos,
    loading,
    error,
    currentVideoId,
    onSelectVideo,
}) {
    return (
        <div className="mt-2 flex-1 min-h-0 overflow-y-auto">
            {loading && (
                <p className="text-xs text-slate-500">Loading videos...</p>
            )}

            {error && !loading && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            {!loading && !error && videos.length === 0 && (
                <p className="text-xs text-slate-500">
                    No videos found. Try a different search or filter.
                </p>
            )}

            {!loading && !error && videos.length > 0 && (
                <ul className="flex flex-col gap-1">
                    {videos.map((v) => {
                        const isActive = currentVideoId === v.id;
                        const groupName = getGroupName(v);

                        return (
                            <li key={v.id}>
                                <button
                                    type="button"
                                    onClick={() => onSelectVideo(v.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex flex-col border ${isActive
                                            ? "bg-slate-800 border-pink-500 text-slate-50"
                                            : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800/60"
                                        }`}
                                >
                                    <span className="font-medium">
                                        {v.title || "Untitled"}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {groupName
                                            ? `${groupName} · `
                                            : ""}
                                        {v.category || "video"}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default VideoList;
