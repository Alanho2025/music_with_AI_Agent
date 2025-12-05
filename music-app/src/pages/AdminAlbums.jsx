// src/pages/AdminAlbums.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSecureApi } from "../api/secureClient";
import AlbumList from "../components/admin/AlbumList";
import AlbumForm from "../components/admin/AlbumForm";

function AdminAlbums() {
    const api = useSecureApi();

    const [albums, setAlbums] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(null);

    // load albums list
    useEffect(() => {
        let cancelled = false;

        async function loadAlbums() {
            try {
                const res = await api.get("/admin/albums");
                if (cancelled) return;
                setAlbums(res.data);
                if (res.data.length > 0) {
                    setSelectedId(res.data[0].id);
                }
            } catch (err) {
                console.error(err);
            }
        }

        loadAlbums();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // load single album detail
    useEffect(() => {
        if (!selectedId) return;
        let cancelled = false;

        async function loadDetail() {
            setLoading(true);
            try {
                const res = await api.get(`/admin/albums/${selectedId}`);
                if (cancelled) return;
                setAlbum(res.data.album || {});
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDetail();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    // filter list
    const filteredAlbums = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return albums;
        return albums.filter((a) =>
            [a.title, a.group_name]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term)
        );
    }, [albums, search]);

    // change handler
    const handleAlbumChange = (field, value) => {
        setAlbum((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // save existing album
    const handleSave = async () => {
        if (!selectedId || !album) return;
        setSaving(true);
        setStatus(null);
        try {
            const res = await api.put(`/admin/albums/${selectedId}`, { album });
            const updated = res.data?.album || album;

            // 更新 list 裡的那一筆
            setAlbums((prev) =>
                prev.map((a) =>
                    a.id === selectedId ? { ...a, ...updated } : a
                )
            );

            setStatus({
                type: "success",
                message: "Album updated.",
            });
        } catch (err) {
            console.error(err);
            setStatus({
                type: "error",
                message: "Save failed.",
            });
        } finally {
            setSaving(false);
        }
    };

    // create new album
    const handleCreateNew = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const payload = {
                album: {
                    title: "New album",
                    group_id: null,
                    release_date: null,
                    country: "",
                    sales: null,
                    peak_chart: null,
                    img_url: "",
                },
            };

            const res = await api.post("/admin/albums", payload);
            const created = res.data.album || res.data;

            setAlbums((prev) => [created, ...prev]);
            setSelectedId(created.id);
            setAlbum(created);

            setStatus({
                type: "success",
                message: "Album created.",
            });
        } catch (err) {
            console.error(err);
            setStatus({
                type: "error",
                message: "Create failed.",
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!status) return;
        const timer = setTimeout(() => setStatus(null), 3000);
        return () => clearTimeout(timer);
    }, [status]);

    return (
        <div className="flex gap-4">
            <AlbumList
                albums={filteredAlbums}
                selectedId={selectedId}
                onSelect={setSelectedId}
                search={search}
                onSearchChange={setSearch}
                onCreate={handleCreateNew}   // 👈 傳給列表
            />

            <AlbumForm
                loading={loading}
                album={album}
                saving={saving}
                status={status}
                onChange={handleAlbumChange}
                onSave={handleSave}
            />
        </div>
    );
}

export default AdminAlbums;
