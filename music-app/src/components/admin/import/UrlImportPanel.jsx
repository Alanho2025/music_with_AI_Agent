// src/components/admin/import/UrlImportPanel.jsx
import React, { useState } from "react";
import axios from "axios";

const emptyGroup = {
    name: "",
    korean_name: "",
    gender: "",
    debut_date: "",
    company: "",
    members_count: "",
    original_members: "",
    fanclub_name: "",
    active: true,
};

const emptyIdol = {
    stage_name: "",
    birth_name: "",
    korean_name: "",
    position: "",
    birthdate: "",
    nationality: "",
    image_url: "",
};

const emptyAlbum = {
    title: "",
    release_date: "",
    country: "",
    sales: "",
    peak_chart: "",
};

function UrlImportPanel() {
    const [url, setUrl] = useState("");
    const [group, setGroup] = useState(emptyGroup);
    const [idols, setIdols] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    function resetForms() {
        setGroup(emptyGroup);
        setIdols([]);
        setAlbums([]);
    }

    async function handleImport() {
        setLoading(true);
        setSaving(false);
        setError(null);
        setMessage(null);
        resetForms();

        try {
            const res = await axios.post(
                "http://localhost:8080/api/import/url",
                { url }
            );

            const parsed = res.data.parsed || res.data;

            const g = parsed.group || {};
            setGroup({
                ...emptyGroup,
                ...g,
            });

            const idolList = Array.isArray(parsed.idols) ? parsed.idols : [];
            setIdols(
                idolList.length
                    ? idolList.map((i) => ({ ...emptyIdol, ...i }))
                    : []
            );

            const albumList = Array.isArray(parsed.albums) ? parsed.albums : [];
            setAlbums(
                albumList.length
                    ? albumList.map((a) => ({ ...emptyAlbum, ...a }))
                    : []
            );
        } catch (err) {
            console.error("[UrlImportPanel] import error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to scrape URL."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            await axios.post("http://localhost:8080/api/import/save", {
                parsed: {
                    group,
                    idols,
                    albums,
                },
            });
            setMessage("Saved to database.");
        } catch (err) {
            console.error("[UrlImportPanel] save error:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to save to database."
            );
        } finally {
            setSaving(false);
        }
    }

    function updateGroupField(field, value) {
        setGroup((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function updateIdolField(index, field, value) {
        setIdols((prev) =>
            prev.map((idol, i) =>
                i === index ? { ...idol, [field]: value } : idol
            )
        );
    }

    function addIdol() {
        setIdols((prev) => [...prev, { ...emptyIdol }]);
    }

    function removeIdol(index) {
        setIdols((prev) => prev.filter((_, i) => i !== index));
    }

    function updateAlbumField(index, field, value) {
        setAlbums((prev) =>
            prev.map((album, i) =>
                i === index ? { ...album, [field]: value } : album
            )
        );
    }

    function addAlbum() {
        setAlbums((prev) => [...prev, { ...emptyAlbum }]);
    }

    function removeAlbum(index) {
        setAlbums((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Import From URL</h2>

            {/* URL input */}
            <div className="flex flex-col gap-2">
                <input
                    className="w-full bg-slate-800 px-3 py-2 rounded"
                    placeholder="https://kprofiles.com/itzy-members-profile/"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <button
                    onClick={handleImport}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm font-medium"
                    disabled={loading || !url}
                >
                    {loading ? "Scraping..." : "Import"}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {message && <p className="text-emerald-400 text-sm">{message}</p>}

            {/* GROUP FORM */}
            <div className="mt-2">
                <h3 className="text-sm font-semibold mb-2 text-slate-200">
                    Group
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">Name</label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.name}
                            onChange={(e) =>
                                updateGroupField("name", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">Korean name</label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.korean_name}
                            onChange={(e) =>
                                updateGroupField("korean_name", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">Gender</label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.gender}
                            onChange={(e) =>
                                updateGroupField("gender", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">Debut date</label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            placeholder="YYYY-MM-DD"
                            value={group.debut_date || ""}
                            onChange={(e) =>
                                updateGroupField("debut_date", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">Company</label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.company}
                            onChange={(e) =>
                                updateGroupField("company", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">
                            Fanclub name
                        </label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.fanclub_name}
                            onChange={(e) =>
                                updateGroupField(
                                    "fanclub_name",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">
                            Members count
                        </label>
                        <input
                            type="number"
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.members_count || ""}
                            onChange={(e) =>
                                updateGroupField(
                                    "members_count",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-slate-400">
                            Original members
                        </label>
                        <input
                            className="bg-slate-800 px-2 py-1 rounded"
                            value={group.original_members}
                            onChange={(e) =>
                                updateGroupField(
                                    "original_members",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            {/* IDOLS FORM */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-200">
                        Idols
                    </h3>
                    <button
                        type="button"
                        onClick={addIdol}
                        className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                    >
                        + Add idol
                    </button>
                </div>

                {idols.length === 0 && (
                    <p className="text-xs text-slate-500">
                        No idols parsed. You can add rows manually.
                    </p>
                )}

                <div className="flex flex-col gap-3 max-h-80 overflow-auto">
                    {idols.map((idol, index) => (
                        <div
                            key={index}
                            className="border border-slate-800 rounded p-2 flex flex-col gap-2 text-xs"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    Idol #{index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeIdol(index)}
                                    className="text-red-400 text-[11px]"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Stage name"
                                    value={idol.stage_name}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "stage_name",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Birth name"
                                    value={idol.birth_name}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "birth_name",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Korean name"
                                    value={idol.korean_name}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "korean_name",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Position"
                                    value={idol.position}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "position",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Birthdate (YYYY-MM-DD)"
                                    value={idol.birthdate || ""}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "birthdate",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Nationality"
                                    value={idol.nationality}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "nationality",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded md:col-span-3"
                                    placeholder="Image URL"
                                    value={idol.image_url}
                                    onChange={(e) =>
                                        updateIdolField(
                                            index,
                                            "image_url",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ALBUMS FORM */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-slate-200">
                        Albums
                    </h3>
                    <button
                        type="button"
                        onClick={addAlbum}
                        className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                    >
                        + Add album
                    </button>
                </div>

                {albums.length === 0 && (
                    <p className="text-xs text-slate-500">
                        No albums parsed. You can add rows manually.
                    </p>
                )}

                <div className="flex flex-col gap-3 max-h-64 overflow-auto">
                    {albums.map((album, index) => (
                        <div
                            key={index}
                            className="border border-slate-800 rounded p-2 flex flex-col gap-2 text-xs"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    Album #{index + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeAlbum(index)}
                                    className="text-red-400 text-[11px]"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Title"
                                    value={album.title}
                                    onChange={(e) =>
                                        updateAlbumField(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Release date (YYYY-MM-DD)"
                                    value={album.release_date || ""}
                                    onChange={(e) =>
                                        updateAlbumField(
                                            index,
                                            "release_date",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Country"
                                    value={album.country}
                                    onChange={(e) =>
                                        updateAlbumField(
                                            index,
                                            "country",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Sales"
                                    value={album.sales}
                                    onChange={(e) =>
                                        updateAlbumField(
                                            index,
                                            "sales",
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    className="bg-slate-800 px-2 py-1 rounded"
                                    placeholder="Peak chart"
                                    value={album.peak_chart}
                                    onChange={(e) =>
                                        updateAlbumField(
                                            index,
                                            "peak_chart",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SAVE BUTTON */}
            <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm font-medium mt-2"
                disabled={saving}
            >
                {saving ? "Saving..." : "Save to Database"}
            </button>
        </div>
    );
}

export default UrlImportPanel;
