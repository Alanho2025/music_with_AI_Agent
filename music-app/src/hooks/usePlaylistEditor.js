// src/hooks/usePlaylistEditor.js
import { useEffect, useState } from "react";

export function usePlaylistEditor(api, videoById) {
    const [playlists, setPlaylists] = useState([]);
    const [playlistsLoading, setPlaylistsLoading] = useState(false);

    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistItems, setPlaylistItems] = useState([]); // [{ video_id, video }]

    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [playlistError, setPlaylistError] = useState("");
    const [dirty, setDirty] = useState(false);

    // 抓 playlists 列表
    useEffect(() => {
        let cancelled = false;

        async function fetchPlaylists() {
            try {
                setPlaylistsLoading(true);
                const res = await api.get("/playlists");
                if (cancelled) return;
                const rows = Array.isArray(res.data) ? res.data : [];
                setPlaylists(rows);
            } catch (err) {
                if (cancelled) return;
                console.error("Failed to load playlists", err);
            } finally {
                if (!cancelled) {
                    setPlaylistsLoading(false);
                }
            }
        }

        fetchPlaylists();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const resetNewPlaylist = () => {
        setSelectedPlaylistId(null);
        setPlaylistName("");
        setPlaylistItems([]);
        setDirty(false);
        setPlaylistError("");
        setSaveMessage("");
    };

    const loadPlaylistDetails = async (id) => {
        try {
            setPlaylistError("");
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
            setSaveMessage("");
        } catch (err) {
            console.error("Failed to load playlist", err);
            setPlaylistError(
                err.response?.data?.error ||
                "Failed to load playlist. Please try again."
            );
        }
    };

    const handleSelectPlaylist = async (value) => {
        if (value === "new") {
            if (dirty && !window.confirm("Discard unsaved changes?")) {
                return;
            }
            resetNewPlaylist();
            return;
        }

        if (dirty && !window.confirm("Discard unsaved changes?")) {
            return;
        }

        const id = Number(value);
        if (!id) return;

        await loadPlaylistDetails(id);
    };

    const handleNameChange = (value) => {
        setPlaylistName(value);
        setDirty(true);
        setSaveMessage("");
    };

    const addVideoToPlaylist = (videoId) => {
        const video = videoById.get(videoId);
        if (!video) return;

        const already = playlistItems.some(
            (item) => item.video_id === videoId
        );
        if (already) return;

        const nextItems = [
            ...playlistItems,
            { video_id: videoId, video: video },
        ];
        setPlaylistItems(nextItems);
        setDirty(true);
        setSaveMessage("");
    };

    const removeItem = (index) => {
        const next = playlistItems.filter((_, i) => i !== index);
        setPlaylistItems(next);
        setDirty(true);
        setSaveMessage("");
    };

    const moveItemUp = (index) => {
        if (index <= 0) return;
        const next = [...playlistItems];
        const tmp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = tmp;
        setPlaylistItems(next);
        setDirty(true);
        setSaveMessage("");
    };

    const moveItemDown = (index) => {
        if (index >= playlistItems.length - 1) return;
        const next = [...playlistItems];
        const tmp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = tmp;
        setPlaylistItems(next);
        setDirty(true);
        setSaveMessage("");
    };

    const handleSavePlaylist = async () => {
        try {
            setPlaylistError("");
            setSaveMessage("");

            if (!playlistName.trim()) {
                setPlaylistError("Playlist name is required.");
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

            // refresh playlists
            const listRes = await api.get("/playlists");
            setPlaylists(Array.isArray(listRes.data) ? listRes.data : []);

            setDirty(false);
            setSaveMessage("Playlist saved.");
        } catch (err) {
            console.error("Failed to save playlist", err);
            setPlaylistError(
                err.response?.data?.error ||
                "Failed to save playlist. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return {
        playlists,
        playlistsLoading,
        selectedPlaylistId,
        playlistName,
        playlistItems,
        saving,
        saveMessage,
        playlistError,
        dirty,
        handleSelectPlaylist,
        handleNameChange,
        addVideoToPlaylist,
        removeItem,
        moveItemUp,
        moveItemDown,
        handleSavePlaylist,
    };
}
