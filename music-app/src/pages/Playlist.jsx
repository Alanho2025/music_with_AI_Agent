// src/pages/Playlist.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSecureApi } from "../api/secureClient";
import VideoFilters from "../components/music/VideoFilters";
import VideoList from "../components/music/VideoList";

// 從 video 取 group 名稱的 helper
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

function Playlist() {
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [videosError, setVideosError] = useState("");
    const api = useSecureApi();
    const [playlists, setPlaylists] = useState([]);
    const [playlistsLoading, setPlaylistsLoading] = useState(false);

    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistItems, setPlaylistItems] = useState([]); // [{ video_id, video }]
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const [dirty, setDirty] = useState(false);

    // 左側 filter state（沿用 MusicPlayer）
    const [searchTerm, setSearchTerm] = useState("");
    const [groupFilter, setGroupFilter] = useState("All groups");
    const [sortBy, setSortBy] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");

    // 初始化：抓 videos + playlists
    useEffect(() => {
        async function fetchVideos() {
            try {
                setVideosLoading(true);
                setVideosError("");
                const res = await api.get("/videos");
                const rows = Array.isArray(res.data) ? res.data : [];
                setVideos(rows);
            } catch (err) {
                console.error("Failed to load videos", err);
                setVideosError(
                    err.response?.data?.error ||
                    "Failed to load videos. Please try again."
                );
            } finally {
                setVideosLoading(false);
            }
        }

        async function fetchPlaylists() {
            try {
                setPlaylistsLoading(true);
                const res = await api.get("/playlists");
                const rows = Array.isArray(res.data) ? res.data : [];
                setPlaylists(rows);
            } catch (err) {
                console.error("Failed to load playlists", err);
            } finally {
                setPlaylistsLoading(false);
            }
        }

        fetchVideos();
        fetchPlaylists();
    }, []);

    const groupOptions = useMemo(() => {
        const names = new Set();
        videos.forEach((v) => {
            const name = getGroupName(v);
            if (name) names.add(name);
        });
        return Array.from(names).sort();
    }, [videos]);

    const filteredVideos = useMemo(() => {
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
    }, [videos, searchTerm, groupFilter, sortBy, sortDirection]);

    // 把 video_id map 成完整 video 物件
    const videoById = useMemo(() => {
        const map = new Map();
        videos.forEach((v) => map.set(v.id, v));
        return map;
    }, [videos]);

    // 左側列表目前選中哪一首（只是高亮用）
    const [currentVideoId, setCurrentVideoId] = useState(null);

    // 載入 playlist 詳細內容
    async function loadPlaylistDetails(id) {
        if (!id) {
            // 新 playlist
            setSelectedPlaylistId(null);
            setPlaylistName("");
            setPlaylistItems([]);
            setDirty(false);
            setError("");
            return;
        }

        try {
            setError("");
            const res = await api.get(`/playlists/${id}`);
            const data = res.data;

            setSelectedPlaylistId(data.id);
            setPlaylistName(data.name || "");

            const items = Array.isArray(data.items) ? data.items : [];
            const mapped = items
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => {
                    const fullVideo =
                        videoById.get(item.video_id) || {
                            id: item.video_id,
                            title: item.title,
                            youtube_id: item.youtube_id,
                            category: item.category,
                            group_name: item.group_name,
                        };
                    return {
                        video_id: item.video_id,
                        video: fullVideo,
                    };
                });

            setPlaylistItems(mapped);
            setDirty(false);
        } catch (err) {
            console.error("Failed to load playlist", err);
            setError(
                err.response?.data?.error ||
                "Failed to load playlist. Please try again."
            );
        }
    }

    // 處理 playlists 下拉切換
    const handleChangePlaylistSelect = async (e) => {
        const value = e.target.value;
        if (value === "new") {
            if (dirty && !window.confirm("Discard unsaved changes?")) {
                // 還原 select value
                return;
            }
            setSelectedPlaylistId(null);
            setPlaylistName("");
            setPlaylistItems([]);
            setDirty(false);
            setSaveMessage("");
            return;
        }

        if (dirty && !window.confirm("Discard unsaved changes?")) {
            return;
        }

        const id = Number(value);
        await loadPlaylistDetails(id);
        setSaveMessage("");
    };

    // 把某個 video 加到 playlist 底部
    const addVideoToPlaylist = (videoId) => {
        const video = videoById.get(videoId);
        if (!video) return;

        const already = playlistItems.some(
            (item) => item.video_id === videoId
        );
        if (already) {
            return;
        }

        const nextItems = [
            ...playlistItems,
            { video_id: videoId, video: video },
        ];
        setPlaylistItems(nextItems);
        setDirty(true);
    };

    // 拖拉：從左邊拖 video 到右邊
    const handleDragStartFromLibrary = (event, videoId) => {
        event.dataTransfer.setData("text/plain", String(videoId));
        event.dataTransfer.effectAllowed = "copy";
    };

    const handleDropToPlaylist = (event) => {
        event.preventDefault();
        const text = event.dataTransfer.getData("text/plain");
        const videoId = Number(text);
        if (!videoId) return;
        addVideoToPlaylist(videoId);
    };

    const handleDragOverPlaylist = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    // 移除 / 排序
    const removeItem = (index) => {
        const next = playlistItems.filter((_, i) => i !== index);
        setPlaylistItems(next);
        setDirty(true);
    };

    const moveItemUp = (index) => {
        if (index <= 0) return;
        const next = [...playlistItems];
        const tmp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = tmp;
        setPlaylistItems(next);
        setDirty(true);
    };

    const moveItemDown = (index) => {
        if (index >= playlistItems.length - 1) return;
        const next = [...playlistItems];
        const tmp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = tmp;
        setPlaylistItems(next);
        setDirty(true);
    };

    // Save / Update playlist
    const handleSavePlaylist = async () => {
        try {
            setError("");
            setSaveMessage("");
            if (!playlistName.trim()) {
                setError("Playlist name is required.");
                return;
            }

            const videoIds = playlistItems.map((item) => item.video_id);
            const payload = {
                name: playlistName.trim(),
                video_ids: videoIds,
            };

            setSaving(true);

            if (selectedPlaylistId) {
                await api.put(`/playlists/${selectedPlaylistId}`, payload);
            } else {
                const res = await api.post("/playlists", payload);
                const created = res.data;
                setSelectedPlaylistId(created.id);
            }

            // 重新刷新 playlists 列表
            const listRes = await api.get("/playlists");
            setPlaylists(Array.isArray(listRes.data) ? listRes.data : []);

            setDirty(false);
            setSaveMessage("Playlist saved.");
        } catch (err) {
            console.error("Failed to save playlist", err);
            setError(
                err.response?.data?.error ||
                "Failed to save playlist. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full px-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Playlists
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Create your own playlists by dragging videos from the
                    library on the left.
                </p>
            </header>

            <section className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[1.4fr,1.6fr] gap-4">
                {/* 左邊：Videos Library */}
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

                    <VideoList
                        videos={filteredVideos}
                        loading={videosLoading}
                        error={videosError}
                        currentVideoId={currentVideoId}
                        onSelectVideo={setCurrentVideoId}
                        enableDrag
                        onDragStartVideo={handleDragStartFromLibrary}
                        showAddButton
                        onAddToPlaylist={addVideoToPlaylist}
                    />
                </div>

                {/* 右邊：Playlist 編輯區 */}
                <div className="flex flex-col gap-4">
                    {/* 上：playlist meta */}
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                                <label className="text-xs text-slate-400">
                                    Playlist name
                                </label>
                                <input
                                    type="text"
                                    value={playlistName}
                                    onChange={(e) => {
                                        setPlaylistName(e.target.value);
                                        setDirty(true);
                                    }}
                                    placeholder="e.g. LE SSERAFIM Starter Pack"
                                    className="rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1 min-w-[180px]">
                                <label className="text-xs text-slate-400">
                                    Existing playlists
                                </label>
                                <select
                                    value={
                                        selectedPlaylistId
                                            ? String(selectedPlaylistId)
                                            : "new"
                                    }
                                    onChange={handleChangePlaylistSelect}
                                    className="rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                >
                                    <option value="new">
                                        + New playlist
                                    </option>
                                    {playlists.map((pl) => (
                                        <option
                                            key={pl.id}
                                            value={String(pl.id)}
                                        >
                                            {pl.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={handleSavePlaylist}
                                disabled={saving}
                                className="self-end ml-auto px-4 py-2 rounded-md bg-pink-500 text-xs font-medium text-white hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? "Saving..."
                                    : selectedPlaylistId
                                        ? "Save changes"
                                        : "Create playlist"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-xs text-red-400 mt-1">
                                {error}
                            </p>
                        )}
                        {saveMessage && !error && (
                            <p className="text-xs text-emerald-400 mt-1">
                                {saveMessage}
                            </p>
                        )}
                        {dirty && !saving && (
                            <p className="text-[11px] text-amber-300 mt-1">
                                You have unsaved changes.
                            </p>
                        )}
                    </div>

                    {/* 中：playlist items + 拖拉區 */}
                    <div
                        className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex-1 flex flex-col"
                        onDragOver={handleDragOverPlaylist}
                        onDrop={handleDropToPlaylist}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Tracks in this playlist
                            </h2>
                            <span className="text-[11px] text-slate-500">
                                {playlistItems.length} tracks
                            </span>
                        </div>

                        {playlistItems.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-700 rounded-md">
                                Drag videos from the left or press + to add
                                them here.
                            </div>
                        ) : (
                            <ul className="flex-1 flex flex-col gap-1 overflow-y-auto">
                                {playlistItems.map((item, index) => {
                                    const v = item.video;
                                    const groupName = getGroupName(v);
                                    return (
                                        <li key={`${item.video_id}-${index}`}>
                                            <div className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                                                <span className="w-6 text-slate-500">
                                                    {index + 1}.
                                                </span>
                                                <div className="flex-1 flex flex-col">
                                                    <span className="text-slate-100">
                                                        {v?.title ||
                                                            "Untitled"}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {groupName &&
                                                            `${groupName} · `}
                                                        {v?.category ||
                                                            "video"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            moveItemUp(index)
                                                        }
                                                        className="px-2 py-0.5 rounded-md border border-slate-700 text-[10px] hover:bg-slate-800"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            moveItemDown(
                                                                index
                                                            )
                                                        }
                                                        className="px-2 py-0.5 rounded-md border border-slate-700 text-[10px] hover:bg-slate-800"
                                                    >
                                                        ↓
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                    className="ml-2 px-2 py-1 rounded-md border border-slate-700 text-[10px] text-red-300 hover:bg-red-900/40"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* 下：小提示 */}
                    <p className="text-[11px] text-slate-500">
                        Tip: Playlists are saved per user. In the future you
                        can connect this with the Music Player page to play a
                        whole list in order.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Playlist;
