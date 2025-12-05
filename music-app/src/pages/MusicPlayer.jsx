// src/pages/MusicPlayer.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import VideoFilters from "../components/music/VideoFilters";
import VideoList from "../components/music/VideoList";
import VideoPlayerPanel from "../components/music/VideoPlayerPanel";
import { useSecureApi } from "../api/secureClient";
import PlaylistFilters from "../components/music/PlaylistFilters";
import { useLocation } from "react-router-dom";

// 小 helper：嘗試從多個欄位抓 group 名稱
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

function MusicPlayer() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramYoutubeId = params.get("youtube");
    const paramTitle = params.get("title");

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // group filter / 排序
    const [groupFilter, setGroupFilter] = useState("All groups");
    const [sortBy, setSortBy] = useState("title"); // "title" | "group"
    const [sortDirection, setSortDirection] = useState("asc"); // "asc" | "desc"

    const [currentVideoId, setCurrentVideoId] = useState(null);
    const autoNextTimeoutRef = useRef(null);

    // playlists
    const secureApi = useSecureApi();
    const [playlists, setPlaylists] = useState([]);
    const [playlistFilter, setPlaylistFilter] = useState(null); // null = 不使用 playlist
    const [playlistItems, setPlaylistItems] = useState([]);

    // ✅ deep-link 進來的「臨時影片」，例如從 timeline 點過來
    const [deepLinkVideo, setDeepLinkVideo] = useState(null);

    // 抓全部 videos
    useEffect(() => {
        async function fetchVideos() {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/videos");
                const rows = Array.isArray(res.data) ? res.data : [];
                setVideos(rows);

                if (rows.length > 0 && currentVideoId == null) {
                    setCurrentVideoId(rows[0].id);
                }
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
    }, []); // 只在首次載入時跑

    // ✅ 抓 playlists 清單
    useEffect(() => {
        async function loadPlaylists() {
            try {
                const res = await secureApi.get("/playlists");
                setPlaylists(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                console.error("Failed to load playlists", e);
            }
        }
        loadPlaylists();
    }, [secureApi]);

    // ✅ 如果 URL 有帶 youtube / title，就嘗試設定目前播放影片
    useEffect(() => {
        if (!paramYoutubeId) {
            setDeepLinkVideo(null);
            return;
        }

        // 先看這支影片是不是在 videos 裡
        const match = videos.find((v) => v.youtube_id === paramYoutubeId);

        if (match) {
            // 在列表中就直接選這支
            setCurrentVideoId(match.id);
            setDeepLinkVideo(null);
        } else {
            // 不在列表中，就建立一個臨時的 deepLinkVideo 來播
            setDeepLinkVideo({
                id: -1,
                title: paramTitle || "Track",
                youtube_id: paramYoutubeId,
                duration_seconds: null,
                group_name: "",
            });
            setCurrentVideoId(null);
        }
    }, [paramYoutubeId, paramTitle, videos]);

    // 點選 playlist tag
    async function handlePlaylistSelect(id) {
        // 再點一次同一個 playlist 就取消（回到全部歌曲）
        if (playlistFilter === id) {
            setPlaylistFilter(null);
            setPlaylistItems([]);
            return;
        }

        setPlaylistFilter(id);

        if (!id) {
            setPlaylistItems([]);
            return;
        }

        try {
            const res = await secureApi.get(`/playlists/${id}`);
            const items = res.data.items || [];

            const mapped = items.map((i) => ({
                video_id: i.video_id,
                video: {
                    id: i.video_id,
                    title: i.title,
                    youtube_id: i.youtube_id,
                    category: i.category,
                    group_name: i.group_name,
                    duration_seconds: i.duration_seconds,
                },
            }));

            setPlaylistItems(mapped);

            if (mapped.length > 0) {
                setCurrentVideoId(mapped[0].video_id);
            }
        } catch (err) {
            console.error("Failed to load playlist", err);
        }
    }

    // group 選項：用 helper 抓所有 group 名
    const groupOptions = useMemo(() => {
        const names = new Set();
        videos.forEach((v) => {
            const name = getGroupName(v);
            if (name) names.add(name);
        });
        return Array.from(names).sort();
    }, [videos]);

    // 搜尋 + group filter + 排序 + playlist 模式
    const filteredVideos = useMemo(() => {
        // ▶ 如果有選 playlist，就直接用 playlistItems
        if (playlistFilter && playlistItems.length > 0) {
            return playlistItems.map((i) => i.video);
        }

        const term = searchTerm.trim().toLowerCase();

        const filtered = videos.filter((v) => {
            const groupName = getGroupName(v);
            const matchGroup =
                groupFilter === "All groups" || groupName === groupFilter;

            if (!term) return matchGroup;

            const haystack = [
                v.title,
                groupName,
                v.category,
                v.tags,
                v.description,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchSearch = haystack.includes(term);
            return matchGroup && matchSearch;
        });

        // 排序
        const sorted = [...filtered].sort((a, b) => {
            let aField;
            let bField;

            if (sortBy === "group") {
                aField = getGroupName(a).toLowerCase();
                bField = getGroupName(b).toLowerCase();
            } else {
                aField = (a.title || "").toLowerCase();
                bField = (b.title || "").toLowerCase();
            }

            if (aField < bField) return sortDirection === "asc" ? -1 : 1;
            if (aField > bField) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [
        videos,
        searchTerm,
        groupFilter,
        sortBy,
        sortDirection,
        playlistFilter,
        playlistItems,
    ]);

    // ✅ 決定目前播放哪一支 video
    const currentVideo = useMemo(() => {
        // 如果有 deep-link，就優先播它
        if (deepLinkVideo) return deepLinkVideo;

        if (!filteredVideos.length) return null;
        if (currentVideoId == null) return filteredVideos[0];

        const found = filteredVideos.find((v) => v.id === currentVideoId);
        return found || filteredVideos[0];
    }, [filteredVideos, currentVideoId, deepLinkVideo]);

    const currentIndex = useMemo(() => {
        if (!currentVideo || deepLinkVideo) return -1; // deep-link 不在列表裡
        return filteredVideos.findIndex((v) => v.id === currentVideo.id);
    }, [filteredVideos, currentVideo, deepLinkVideo]);

    const upNext = useMemo(() => {
        if (currentIndex === -1) return [];
        return filteredVideos.slice(currentIndex + 1, currentIndex + 3);
    }, [filteredVideos, currentIndex]);

    const handleSelectVideo = (id) => {
        setCurrentVideoId(id);
        setDeepLinkVideo(null); // 手動選歌時就回到正常模式
    };

    const handlePrev = () => {
        if (!filteredVideos.length || currentIndex <= 0) return;
        setCurrentVideoId(filteredVideos[currentIndex - 1].id);
        setDeepLinkVideo(null);
    };

    const handleNext = () => {
        if (!filteredVideos.length) return;
        if (currentIndex === -1) {
            setCurrentVideoId(filteredVideos[0].id);
            setDeepLinkVideo(null);
            return;
        }
        const next = filteredVideos[currentIndex + 1];
        if (next) {
            setCurrentVideoId(next.id);
            setDeepLinkVideo(null);
        }
    };

    // 自動播下一首：duration_seconds + 5 秒
    useEffect(() => {
        // 如果是 deep-link 的臨時影片，先不要自動跳下一首
        if (!currentVideo || deepLinkVideo) return;

        if (autoNextTimeoutRef.current) {
            clearTimeout(autoNextTimeoutRef.current);
        }

        const durationSeconds = Number(currentVideo.duration_seconds || 0);
        if (!durationSeconds || durationSeconds <= 0) return;

        const delay = durationSeconds * 1000 + 5000;

        autoNextTimeoutRef.current = setTimeout(() => {
            handleNext();
        }, delay);

        return () => {
            if (autoNextTimeoutRef.current) {
                clearTimeout(autoNextTimeoutRef.current);
            }
        };
    }, [currentVideo?.id, filteredVideos.length, deepLinkVideo]);

    const youtubeUrl = currentVideo?.youtube_id
        ? `https://www.youtube.com/embed/${currentVideo.youtube_id}?rel=0`
        : null;

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
                        currentVideoId={currentVideo && currentVideo.id > 0 ? currentVideo.id : null}
                        onSelectVideo={handleSelectVideo}
                    />
                </div>

                <VideoPlayerPanel
                    currentVideo={currentVideo}
                    youtubeUrl={youtubeUrl}
                    hasPrev={currentIndex > 0}
                    hasNext={currentIndex < filteredVideos.length - 1}
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
