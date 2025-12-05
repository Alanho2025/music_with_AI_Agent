import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useSecureApi } from "../api/secureClient";
import UpcomingPlaylist from "./UpcomingPlaylist";

function Player() {
    const { isAuthenticated } = useAuth();
    const api = useSecureApi();

    const [loading, setLoading] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. 拿 playlists
                const playlistsRes = await api.get("/playlists");
                const playlists = playlistsRes.data;

                if (!playlists || playlists.length === 0) {
                    setPlaylist(null);
                    setItems([]);
                    return;
                }

                const first = playlists[0];
                setPlaylist(first);

                // 2. 拿這個 playlist 的 items
                const itemsRes = await api.get(`/playlists/${first.id}/items`);
                setItems(itemsRes.data.items || []);
                setCurrentIndex(0);
            } catch (err) {
                console.error("Player fetch error", err);
                setError("Failed to load playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]); // 登入狀態變化就重新載入

    const hasVideos = items.length > 0;
    const currentItem = hasVideos ? items[currentIndex] : null;
    useEffect(() => {
        if (!currentVideo) return;

        try {
            localStorage.setItem(
                "kpophub:lastPlayed",
                JSON.stringify({
                    id: currentVideo.id,
                    title: currentVideo.title,
                    artist: currentVideo.artist || currentVideo.channel,
                    groupName: currentVideo.group_name,
                    coverUrl: currentVideo.thumbnail_url,
                })
            );
        } catch (err) {
            console.error("Failed to save lastPlayed", err);
        }
    }, [currentVideo]);
    
    const handlePrev = () => {
        if (!hasVideos) return;
        setCurrentIndex((idx) => (idx > 0 ? idx - 1 : idx));
    };

    const handleNext = () => {
        if (!hasVideos) return;
        setCurrentIndex((idx) =>
            idx < items.length - 1 ? idx + 1 : idx
        );
    };

    const embedUrl = currentItem
        ? `https://www.youtube.com/embed/${currentItem.youtube_id}`
        : "";

    if (!isAuthenticated) {
        return (
            <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-3">
                <h2 className="text-lg font-semibold">Player</h2>
                <p className="text-sm text-slate-400">
                    Log in to play your personalized playlists.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">
                        {playlist ? playlist.name : "No playlist yet"}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {hasVideos
                            ? `Track ${currentIndex + 1} of ${items.length}`
                            : "Add videos to your playlist in the backend for now."}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={!hasVideos || currentIndex === 0}
                        className="px-3 py-1 rounded-md text-xs bg-slate-800 disabled:opacity-40"
                    >
                        ◀ Prev
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!hasVideos || currentIndex === items.length - 1}
                        className="px-3 py-1 rounded-md text-xs bg-slate-800 disabled:opacity-40"
                    >
                        Next ▶
                    </button>
                </div>
            </div>

            {loading && (
                <p className="text-sm text-slate-400">
                    Loading playlist...
                </p>
            )}

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            {currentItem && (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                        title={currentItem.title}
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            )}

            {!currentItem && !loading && !error && (
                <p className="text-sm text-slate-400">
                    No videos found in your first playlist.
                </p>
            )}

            {/* 下方小小 queue list */}
            {hasVideos && (
                <UpcomingPlaylist
                    items={items}
                    currentIndex={currentIndex}
                    onSelect={(idx) => setCurrentIndex(idx)}
             />
            )}
        </div>
    );
}

export default Player;
