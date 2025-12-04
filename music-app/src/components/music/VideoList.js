// src/components/music/VideoList.js
import React from "react";

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
    // playlist 專用
    enableDrag = false,
    onDragStartVideo,
    showAddButton = false,
    onAddToPlaylist,
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
                                <div
                                    className={`w-full px-3 py-2 rounded-lg text-sm flex items-center border ${isActive
                                            ? "bg-slate-800 border-pink-500 text-slate-50"
                                            : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800/60"
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onSelectVideo(v.id)}
                                        className="flex-1 text-left flex flex-col"
                                        draggable={enableDrag}
                                        onDragStart={
                                            enableDrag && onDragStartVideo
                                                ? (e) =>
                                                    onDragStartVideo(e, v.id)
                                                : undefined
                                        }
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

                                    {showAddButton && onAddToPlaylist && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onAddToPlaylist(v.id)
                                            }
                                            className="ml-2 text-xs px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default VideoList;
