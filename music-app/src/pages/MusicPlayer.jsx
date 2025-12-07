// src/pages/MusicPlayer.jsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import VideoFilters from "../components/music/VideoFilters";
import VideoList from "../components/music/VideoList";
import VideoPlayerPanel from "../components/music/VideoPlayerPanel";
import { useSecureApi } from "../api/secureClient";
import PlaylistFilters from "../components/music/PlaylistFilters";
import { useLocation } from "react-router-dom";
import { usePlaylistFilter } from "../hooks/usePlaylistFilter";
import { useMusicSelection } from "../hooks/useMusicSelection";

function MusicPlayer() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramYoutubeId = params.get("youtube");
    const paramTitle = params.get("title");

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const secureApi = useSecureApi();

    // 抓全部 videos
    useEffect(() => {
        async function fetchVideos() {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/videos");
                const rows = Array.isArray(res.data) ? res.data : [];
                setVideos(rows);
            } catch (err) {
                console.error("Failed to load videos", err);
                setError(
                    err.response?.data?.error ||
                    "Failed to load videos. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, []);

    // playlist 邏輯
    const {
        playlists,
        playlistFilter,
        playlistItems,
        handlePlaylistSelect,
    } = usePlaylistFilter(secureApi);

    // 播放 / 篩選 / 自動跳下一首
    const {
        searchTerm,
        setSearchTerm,
        groupFilter,
        setGroupFilter,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        groupOptions,
        filteredVideos,
        currentVideo,
        currentIndex,
        upNext,
        handleSelectVideo,
        handlePrev,
        handleNext,
    } = useMusicSelection(
        videos,
        playlistFilter,
        playlistItems,
        paramYoutubeId,
        paramTitle
    );

    const youtubeUrl = currentVideo?.youtube_id
        ? `https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0`
        : null;

    const hasPrev = currentIndex > 0;
    const hasNext =
        currentIndex >= 0 && currentIndex < filteredVideos.length - 1;

    return (
        <div className="flex flex-col gap-4 w-full px-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Music Player
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Browse songs from your database, play them, and see what is
                    coming next.
                </p>
            </header>

            <section className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[1.4fr,1.6fr] gap-4">
                {/* 左：列表 + 篩選 */}
                <div className="flex flex-col gap-3 border-r border-slate-800 pr-2">
                    <VideoFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        groups={groupOptions}
                        groupFilter={groupFilter}
                        onGroupChange={setGroupFilter}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortByChange={setSortBy}
                        onSortDirectionToggle={() =>
                            setSortDirection((prev) =>
                                prev === "asc" ? "desc" : "asc"
                            )
                        }
                    />

                    <PlaylistFilters
                        playlists={playlists}
                        playlistFilter={playlistFilter}
                        onPlaylistChange={handlePlaylistSelect}
                    />

                    <VideoList
                        videos={filteredVideos}
                        loading={loading}
                        error={error}
                        currentVideoId={
                            currentVideo && currentVideo.id > 0
                                ? currentVideo.id
                                : null
                        }
                        onSelectVideo={handleSelectVideo}
                    />
                </div>

                {/* 右：播放器 */}
                <VideoPlayerPanel
                    currentVideo={currentVideo}
                    youtubeUrl={youtubeUrl}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    upNext={upNext}
                    onSelectFromUpNext={handleSelectVideo}
                />
            </section>
        </div>
    );
}

export default MusicPlayer;
