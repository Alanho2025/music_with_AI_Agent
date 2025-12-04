// src/components/music/VideoPlayerPanel.js
import React from "react";

function getVideoTitle(video) {
    if (!video) return "";
    if (video.group_name) {
        return `${video.group_name} - ${video.title}`;
    }
    return video.title || "Untitled video";
}

function VideoPlayerPanel({
    currentVideo,
    youtubeUrl,
    hasPrev,
    hasNext,
    onPrev,
    onNext,
    upNext,
    onSelectFromUpNext,
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
                {/* 標題 + Prev / Next */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-100">
                            {getVideoTitle(currentVideo)}
                        </h2>
                        {currentVideo?.category && (
                            <p className="text-[11px] uppercase tracking-wide text-slate-500 mt-0.5">
                                {currentVideo.category}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {hasPrev && (
                            <button
                                type="button"
                                onClick={onPrev}
                                className="px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
                            >
                                Prev
                            </button>
                        )}
                        {hasNext && (
                            <button
                                type="button"
                                onClick={onNext}
                                className="px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>

                {/* YouTube iframe */}
                <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-800 bg-black">
                    {youtubeUrl ? (
                        <iframe
                            title={getVideoTitle(currentVideo)}
                            src={youtubeUrl}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-slate-500">
                            Select a video to start playing.
                        </div>
                    )}
                </div>

                {/* Up next 區塊 */}
                <div>
                    <h3 className="text-xs font-semibold text-slate-200 mb-2">
                        Up next
                    </h3>
                    {upNext.length === 0 ? (
                        <p className="text-[11px] text-slate-500">
                            No more videos in the current list.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {upNext.map((v) => (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => onSelectFromUpNext(v.id)}
                                    className="w-full text-left px-3 py-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs"
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium text-slate-100">
                                            {v.title || "Untitled"}
                                        </span>
                                        {v.group_name && (
                                            <span className="text-slate-400">
                                                {v.group_name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        {v.category || "video"}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoPlayerPanel;
