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

    // 1) 載入 album list
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

    // 2) 載入單一 album detail
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

    // 3) filter list
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

    // 4) handlers
    const handleAlbumChange = (field, value) => {
        setAlbum((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!selectedId || !album) return;
        setSaving(true);
        setStatus(null);
        try {
            await api.put(`/admin/albums/${selectedId}`, { album });
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
