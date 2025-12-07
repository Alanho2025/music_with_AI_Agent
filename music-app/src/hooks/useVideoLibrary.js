// src/hooks/useVideoLibrary.js
import { useEffect, useMemo, useState } from "react";

export function getGroupName(video) {
    if (!video) return "";
    return (
        video.group_name ||
        video.group ||
        video.groupName ||
        video.artist ||
        ""
    ).trim();
}

export function useVideoLibrary(api) {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [groupFilter, setGroupFilter] = useState("All groups");
    const [sortBy, setSortBy] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");

    const [currentVideoId, setCurrentVideoId] = useState(null);

    // 抓全部 videos
    useEffect(() => {
        let cancelled = false;

        async function fetchVideos() {
            try {
                setLoading(true);
                setError("");
                const res = await api.get("/videos");
                if (cancelled) return;
                const rows = Array.isArray(res.data) ? res.data : [];
                setVideos(rows);
            } catch (err) {
                if (cancelled) return;
                console.error("Failed to load videos", err);
                setError(
                    err.response?.data?.error ||
                    "Failed to load videos. Please try again."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchVideos();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 不依賴 api，避免不停重跑

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

    const videoById = useMemo(() => {
        const map = new Map();
        videos.forEach((v) => map.set(v.id, v));
        return map;
    }, [videos]);

    return {
        // data
        videos,
        loading,
        error,
        filteredVideos,
        videoById,
        // filters
        searchTerm,
        setSearchTerm,
        groupFilter,
        setGroupFilter,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        groupOptions,
        // selection
        currentVideoId,
        setCurrentVideoId,
    };
}
