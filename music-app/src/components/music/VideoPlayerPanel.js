// src/components/music/VideoPlayerPanel.js
import React from "react";
import { useVideoMeta } from "./hooks/useVideoMeta";
import { useComments } from "./hooks/useComments";
import UpNextList from "./UpNextList";
import CommentList from "./CommentList";
import LikeButton from "./LikeButton";
import { useSecureApi } from "../../api/secureClient";
import { useEffect } from "react";
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
    const api = useSecureApi();
    const {
        meta,
        metaLoading,
        liked,
        displayCompany,
        displayViews,
        displayLikes,
        displayGroup,
        handleToggleLike,
    } = useVideoMeta(currentVideo);

    const {
        commentTree,
        commentsLoading,
        commentsError,
        newComment,
        setNewComment,
        replyTo,
        handleReplyClick,
        handleCancelReply,
        handleSubmitComment,
        submitting,
    } = useComments(currentVideo);


    useEffect(() => {
        if (!currentVideo || !currentVideo.id) return;
        if (typeof window === "undefined") return;

        const now = Date.now();
        const storageKey = "last_watch_log";

        // 從 sessionStorage 拿上一筆紀錄
        let last = null;
        const raw = window.sessionStorage.getItem(storageKey);
        if (raw) {
            try {
                last = JSON.parse(raw);
            } catch {
                last = null;
            }
        }

        // 如果「同一個 videoId」在 3 秒內剛剛記錄過，就不要再記一次
        if (
            last &&
            last.videoId === currentVideo.id &&
            now - last.timestamp < 3000
        ) {
            return;
        }

        // 更新 sessionStorage，代表這支影片剛被記錄過
        window.sessionStorage.setItem(
            storageKey,
            JSON.stringify({ videoId: currentVideo.id, timestamp: now })
        );

        async function saveHistory() {
            try {
                await api.post("/users/watch-history", {
                    video_id: currentVideo.id,
                    duration_seconds: currentVideo.duration_seconds || null,
                });
            } catch (err) {
                console.error("Failed to save watch history", err);
            }
        }

        saveHistory();
        // 只依賴 id，避免其他欄位變動也重跑
    }, [currentVideo?.id, api]);
    
    if (!currentVideo) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Select a video to start playing.
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4">
            {/* 上半：播放器 + meta */}
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
                {/* 標題 + Prev / Next */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-100">
                            {getVideoTitle(currentVideo)}
                        </h2>
                        {currentVideo?.category && (
                            <p className="text-[11px] text-slate-400">
                                {currentVideo.category}
                            </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            {displayGroup}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {hasPrev && (
                            <button
                                type="button"
                                onClick={onPrev}
                                className="px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800 text-xs"
                            >
                                Prev
                            </button>
                        )}
                        {hasNext && (
                            <button
                                type="button"
                                onClick={onNext}
                                className="px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800 text-xs"
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
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                            No video URL
                        </div>
                    )}
                </div>

                {/* 公司 + views + likes */}
                <div className="flex items-center justify-between border-y border-slate-800 py-3 text-xs">
                    <div className="flex flex-col">
                        <span className="text-slate-400">Company</span>
                        {metaLoading ? (
                            <span className="text-slate-300">Loading...</span>
                        ) : (
                            <span className="text-slate-100">
                                {displayCompany || "Unknown"}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1 text-slate-300">
                            <span role="img" aria-label="views">
                                👁️
                            </span>
                            <span>{displayViews}</span>
                        </div>

                        <LikeButton
                            liked={liked}
                            likes={displayLikes}
                            onToggle={handleToggleLike}
                        />
                    </div>
                </div>

                {/* Up next */}
                <UpNextList
                    upNext={upNext}
                    onSelectFromUpNext={onSelectFromUpNext}
                />
            </div>

            {/* 下半：留言區 */}
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3 max-h-[420px] overflow-y-auto">
                <h3 className="text-sm font-semibold text-slate-50">
                    Comments
                </h3>

                {/* 新增留言 / 回覆 */}
                <form
                    className="flex flex-col gap-2 mb-2"
                    onSubmit={handleSubmitComment}
                >
                    {replyTo && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>
                                Replying to{" "}
                                <span className="text-sky-400">
                                    {replyTo.authorName}
                                </span>
                            </span>
                            <button
                                type="button"
                                className="text-slate-300 hover:text-slate-100"
                                onClick={handleCancelReply}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <textarea
                        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-50 resize-none focus:outline-none focus:ring focus:ring-sky-600/40"
                        rows={3}
                        placeholder="Add a comment... Use @username to tag."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                        {commentsError && (
                            <p className="text-[11px] text-red-400">
                                {commentsError}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="ml-auto px-3 py-1.5 text-[11px] rounded bg-sky-600 text-white disabled:opacity-40"
                        >
                            {submitting ? "Posting..." : "Comment"}
                        </button>
                    </div>
                </form>

                {/* 留言列表 */}
                <CommentList
                    commentTree={commentTree}
                    commentsLoading={commentsLoading}
                    onReply={handleReplyClick}
                />
            </div>
        </div>
    );
}

export default VideoPlayerPanel;
