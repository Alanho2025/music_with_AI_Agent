// src/pages/AdminVideos.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useSecureApi } from "../api/secureClient";

import { useGroups } from "../hooks/useGroups";
import { useAdminVideos } from "../hooks/useAdminVideos";

import ExistingVideosPanel from "../components/admin/videos/ExistingVideosPanel";
import VideoFormPanel from "../components/admin/videos/VideoFormPanel";

function AdminVideos() {
    const { isAuthenticated } = useAuth();
    const secureApi = useSecureApi();
    const apiRef = useRef(secureApi);
    // public groups
    const { groups } = useGroups();
    const [albums, setAlbums] = useState([]);
    // admin video CRUD + filters + form
    const adminVideos = useAdminVideos({ secureApi, isAuthenticated });
    useEffect(() => {
        if (!isAuthenticated) return;

        let cancelled = false;

        async function loadAlbums() {
            try {
                const res = await apiRef.current.get("/admin/albums");
                if (cancelled) return;
                setAlbums(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load albums for admin videos:", err);
            }
        }

        loadAlbums();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Admin - Videos</h1>
                <p className="text-sm text-slate-400">
                    You need to log in to access the admin video tools.
                </p>
            </div>
        );
    }
    

    const {
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
        handleChange,

        // actions
        handleFetchMeta,
        handleSave,
        handleEdit,
        handleDelete,
        resetForm,
    } = adminVideos;

    return (
        <div className="flex flex-col gap-6 w-full px-8">
            {/* header */}
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Admin - Videos</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Paste a YouTube URL, fetch metadata, tweak fields, and save into your
                    PostgreSQL database. Manage existing songs on the left.
                </p>
            </header>

            {/* layout: left existing songs + right fetch/form */}
            <section className="bg-slate-900 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-6">
               

                <VideoFormPanel
                    groups={groups}
                    youtubeUrl={youtubeUrl}
                    setYoutubeUrl={setYoutubeUrl}
                    loadingMeta={loadingMeta}
                    onFetchMeta={handleFetchMeta}
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSave}
                    saving={saving}
                    selectedVideoId={selectedVideoId}
                    onCancel={resetForm}
                    error={error}
                    message={message}
                    albums={albums}
                />
                <ExistingVideosPanel
                    videos={videos}
                    filteredVideos={filteredVideos}
                    listLoading={listLoading}
                    selectedVideoId={selectedVideoId}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    letterFilter={letterFilter}
                    setLetterFilter={setLetterFilter}
                    groupFilter={groupFilter}
                    setGroupFilter={setGroupFilter}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    groupNameOptions={groupNameOptions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </section>
        </div>
    );
}

export default AdminVideos;
