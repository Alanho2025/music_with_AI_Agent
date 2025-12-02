// src/pages/AdminVideos.jsx
import { useEffect, useState } from "react";
import api from "../api/client"; // public，用來抓 groups
import { useSecureApi } from "../api/secureClient";
import { useAuth } from "../auth/AuthContext";

function AdminVideos() {
    const { isAuthenticated } = useAuth();
    const secureApi = useSecureApi();

    const [groups, setGroups] = useState([]);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
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
    });

    useEffect(() => {
        api
            .get("/groups")
            .then((res) => setGroups(res.data || []))
            .catch((err) => console.error("fetch groups error", err));
    }, []);

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

    const handleFetchMeta = async () => {
        try {
            setError(null);
            setMessage(null);
            setLoadingMeta(true);

            const res = await secureApi.post("/admin/videos/fetch-youtube", {
                youtubeUrl,
            });

            const data = res.data;

            setForm((prev) => ({
                ...prev,
                youtube_id: data.youtube_id,
                title: data.title,
                description: data.description,
                publish_date: data.publish_date
                    ? data.publish_date.slice(0, 10)
                    : "",
                thumbnail_url: data.thumbnail_url || "",
                tags: (data.tags || []).join(", "),
                duration_seconds: data.duration_seconds || "",
                views: data.views || "",
                likes: data.likes || "",
            }));

            setMessage("YouTube metadata loaded. You can adjust fields and save.");
        } catch (err) {
            console.error("fetch meta error", err);
            setError(
                err.response?.data?.error ||
                "Failed to fetch YouTube metadata."
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
        e.preventDefault();
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

            const res = await secureApi.post("/admin/videos", payload);
            setMessage(`Saved video: ${res.data.title}`);

            // 如果你想每次存完清空表單，可以打開這段
            // setForm({
            //   group_id: "",
            //   title: "",
            //   youtube_id: "",
            //   category: "",
            //   tags: "",
            //   publish_date: "",
            //   thumbnail_url: "",
            //   description: "",
            //   mood: "",
            //   style: "",
            //   era: "",
            //   duration_seconds: "",
            //   views: "",
            //   likes: "",
            // });
        } catch (err) {
            console.error("save video error", err);
            setError(
                err.response?.data?.error || "Failed to save video."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-4xl">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Admin - Videos
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Paste a YouTube URL, fetch metadata, tweak fields, and save
                    into your PostgreSQL database.
                </p>
            </header>

            <section className="bg-slate-900 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-400">
                        YouTube URL or ID
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <button
                            onClick={handleFetchMeta}
                            disabled={!youtubeUrl || loadingMeta}
                            className="px-4 py-2 rounded-md bg-emerald-500 text-xs font-semibold disabled:opacity-50"
                        >
                            {loadingMeta ? "Loading..." : "Fetch"}
                        </button>
                    </div>
                </div>

                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={handleSave}
                >
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs text-slate-400">
                                Group
                            </label>
                            <select
                                value={form.group_id}
                                onChange={(e) =>
                                    handleChange("group_id", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            >
                                <option value="">(None)</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                YouTube ID
                            </label>
                            <input
                                type="text"
                                value={form.youtube_id}
                                onChange={(e) =>
                                    handleChange("youtube_id", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                Category
                            </label>
                            <input
                                type="text"
                                value={form.category}
                                onChange={(e) =>
                                    handleChange("category", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                                placeholder="MV, performance, dance practice, OST..."
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={form.tags}
                                onChange={(e) =>
                                    handleChange("tags", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                                placeholder="kpop, le sserafim, performance..."
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                Publish date
                            </label>
                            <input
                                type="date"
                                value={form.publish_date}
                                onChange={(e) =>
                                    handleChange("publish_date", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs text-slate-400">
                                Thumbnail URL
                            </label>
                            <input
                                type="text"
                                value={form.thumbnail_url}
                                onChange={(e) =>
                                    handleChange("thumbnail_url", e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs text-slate-400">
                                    Mood
                                </label>
                                <input
                                    type="text"
                                    value={form.mood}
                                    onChange={(e) =>
                                        handleChange("mood", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                    placeholder="dark, cute..."
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">
                                    Style
                                </label>
                                <input
                                    type="text"
                                    value={form.style}
                                    onChange={(e) =>
                                        handleChange("style", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                    placeholder="MV, dance..."
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">
                                    Era
                                </label>
                                <input
                                    type="text"
                                    value={form.era}
                                    onChange={(e) =>
                                        handleChange("era", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                    placeholder="FEARLESS, EASY..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs text-slate-400">
                                    Duration (sec)
                                </label>
                                <input
                                    type="number"
                                    value={form.duration_seconds}
                                    onChange={(e) =>
                                        handleChange("duration_seconds", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">
                                    Views
                                </label>
                                <input
                                    type="number"
                                    value={form.views}
                                    onChange={(e) =>
                                        handleChange("views", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">
                                    Likes
                                </label>
                                <input
                                    type="number"
                                    value={form.likes}
                                    onChange={(e) =>
                                        handleChange("likes", e.target.value)
                                    }
                                    className="mt-1 w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                rows={6}
                                className="mt-1 w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm resize-y"
                            />
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <button
                                type="submit"
                                disabled={saving || !form.youtube_id || !form.title}
                                className="px-4 py-2 rounded-md bg-emerald-500 text-xs font-semibold disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save video"}
                            </button>
                        </div>
                    </div>
                </form>

                {error && (
                    <p className="text-sm text-red-400 mt-2">
                        {error}
                    </p>
                )}
                {message && (
                    <p className="text-sm text-emerald-400 mt-2">
                        {message}
                    </p>
                )}
            </section>
        </div>
    );
}

export default AdminVideos;
