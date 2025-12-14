// src/hooks/useAdminVideos.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EMPTY_FORM = {
    group_id: "",
    title: "",
    youtube_id: "",
    category: "",
    tags: "",
    publish_date: "",
    thumbnail_url: "",
    description: "",
    mood: "",
    style: "",
    era: "",
    duration_seconds: "",
    views: "",
    likes: "",
};


export function useAdminVideos({ secureApi, isAuthenticated }) {
    // raw data
    const [videos, setVideos] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [albums, setAlbums] = useState([]);
    // filters
    const [searchTerm, setSearchTerm] = useState("");
    const [letterFilter, setLetterFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    // youtube + form
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [form, setForm] = useState(EMPTY_FORM);

    const resetForm = () => {
        setSelectedVideoId(null);
        setForm(EMPTY_FORM);
        setYoutubeUrl("");
    };

    // keep latest secureApi in a ref so that we do not need to depend on it
    const apiRef = useRef(secureApi);
    useEffect(() => {
        apiRef.current = secureApi;
    }, [secureApi]);
    const loadAlbums = useCallback(async () => {
        if (!apiRef.current) return;
        try {
            setListLoading(true);
            setError(null);
            const res = await apiRef.current.get("/admin/albums");
            setAlbums(res.data || []);
        } catch (err) {
            console.error("Failed to load albums", err);
        } finally {
            setListLoading(false);
        }
    }, []);

    const loadVideos = useCallback(async () => {
        if (!apiRef.current) return;

        try {
            setListLoading(true);
            setError(null);
            const res = await apiRef.current.get("/admin/videos");
            setVideos(res.data || []);
        } catch (err) {
            console.error("list videos error", err);
            setError(
                err?.response?.data?.error || "Failed to load existing videos."
            );
        } finally {
            setListLoading(false);
        }
    }, []);

    // only trigger when auth state flips to true
    useEffect(() => {
        if (!isAuthenticated) return;
        loadVideos();
        loadAlbums();
    }, [isAuthenticated, loadVideos, loadAlbums]);

    // unique group names for tag filter
    const groupNameOptions = useMemo(() => {
        const names = new Set();
        videos.forEach((v) => {
            if (v.group_name) names.add(v.group_name);
        });
        return Array.from(names).sort();
    }, [videos]);

    // filtered + sorted videos
    const filteredVideos = useMemo(() => {
        let list = [...videos];

        if (searchTerm.trim()) {
            const q = searchTerm.trim().toLowerCase();
            list = list.filter((v) => {
                return (
                    v.title?.toLowerCase().includes(q) ||
                    v.youtube_id?.toLowerCase().includes(q) ||
                    v.group_name?.toLowerCase().includes(q)
                );
            });
        }

        if (letterFilter) {
            list = list.filter((v) => {
                const first = (v.title || "").trim().charAt(0).toUpperCase();
                return first === letterFilter;
            });
        }

        if (groupFilter) {
            list = list.filter((v) => v.group_name === groupFilter);
        }

        list.sort((a, b) => {
            const t1 = (a.title || "").toLowerCase();
            const t2 = (b.title || "").toLowerCase();
            if (sortOrder === "asc") {
                return t1.localeCompare(t2);
            }
            return t2.localeCompare(t1);
        });

        return list;
    }, [videos, searchTerm, letterFilter, groupFilter, sortOrder]);

    const handleFetchMeta = async () => {
        if (!apiRef.current) return;
        if (!youtubeUrl.trim()) return;

        try {
            setError(null);
            setMessage(null);
            setLoadingMeta(true);

            const res = await apiRef.current.post("/admin/videos/fetch-youtube", {
                youtubeUrl,
            });

            const data = res.data || {};

            setForm((prev) => ({
                ...prev,
                youtube_id: data.youtube_id || prev.youtube_id,
                title: data.title || prev.title,
                description: data.description || prev.description,
                publish_date: data.publish_date
                    ? data.publish_date.slice(0, 10)
                    : prev.publish_date,
                thumbnail_url: data.thumbnail_url || prev.thumbnail_url,
                tags: (data.tags || []).join(", "),
                duration_seconds: data.duration_seconds || prev.duration_seconds,
                views: data.views || prev.views,
                likes: data.likes || prev.likes,
            }));

            setMessage("YouTube metadata loaded. You can adjust fields and save.");
        } catch (err) {
            console.error("fetch meta error", err);
            setError(
                err?.response?.data?.error || "Failed to fetch YouTube metadata."
            );
        } finally {
            setLoadingMeta(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (!apiRef.current) return;

        try {
            setSaving(true);
            setError(null);
            setMessage(null);

            const payload = {
                ...form,
                group_id: form.group_id ? Number(form.group_id) : null,
                duration_seconds: form.duration_seconds
                    ? Number(form.duration_seconds)
                    : null,
                views: form.views ? Number(form.views) : null,
                likes: form.likes ? Number(form.likes) : null,
            };

            let res;
            if (selectedVideoId) {
                res = await apiRef.current.put(
                    `/admin/videos/${selectedVideoId}`,
                    payload
                );
                setMessage(`Updated video: ${res.data.title}`);
            } else {
                res = await apiRef.current.post("/admin/videos", payload);
                setMessage(`Saved video: ${res.data.title}`);
            }

            await loadVideos();
            resetForm();
        } catch (err) {
            console.error("save video error", err);
            setError(err?.response?.data?.error || "Failed to save video.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (video) => {
        if (!video) return;

        setSelectedVideoId(video.id);
        setForm({
            group_id: video.group_id || "",
            album_id: video.album_id || "",
            title: video.title || "",
            youtube_id: video.youtube_id || "",
            category: video.category || "",
            tags: (video.tags || []).join(", "),
            publish_date: video.publish_date
                ? video.publish_date.slice(0, 10)
                : "",
            thumbnail_url: video.thumbnail_url || "",
            description: video.description || "",
            mood: video.mood || "",
            style: video.style || "",
            era: video.era || "",
            duration_seconds: video.duration_seconds || "",
            views: video.views || "",
            likes: video.likes || "",
        });

        setMessage(`Editing: ${video.title}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (videoId) => {
        if (!apiRef.current) return;

        const confirmDelete = window.confirm(
            "Delete this video? It will also be removed from any playlists."
        );
        if (!confirmDelete) return;

        try {
            setError(null);
            setMessage(null);
            await apiRef.current.delete(`/admin/videos/${videoId}`);

            if (selectedVideoId === videoId) {
                resetForm();
            }

            await loadVideos();
            setMessage("Video deleted.");
        } catch (err) {
            console.error("delete video error", err);
            setError(err?.response?.data?.error || "Failed to delete video.");
        }
    };

    return {
        // raw data
        videos,
        listLoading,
        selectedVideoId,

        // filters
        searchTerm,
        setSearchTerm,
        letterFilter,
        setLetterFilter,
        groupFilter,
        setGroupFilter,
        sortOrder,
        setSortOrder,
        groupNameOptions,
        filteredVideos,

        // form + youtube
        youtubeUrl,
        setYoutubeUrl,
        loadingMeta,
        saving,
        error,
        message,
        form,

        // actions
        handleFetchMeta,
        handleChange,
        handleSave,
        handleEdit,
        handleDelete,
        resetForm,
        albums,
    };
}
