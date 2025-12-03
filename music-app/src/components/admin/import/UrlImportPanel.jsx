import React, { useState } from "react";
import axios from "axios";

function UrlImportPanel() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleImport() {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // ⭐ 這裡用「絕對網址」打你的 backend，先不要用 /api/import/url
            const res = await axios.post(
                "http://localhost:8080/api/import/url",
                { url }
            );
            setResult(res.data.parsed || res.data);
        } catch (err) {
            console.error("[UrlImportPanel] import error:", err);
            setError(
                err.response?.data?.error || err.message || "Failed to scrape URL."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!result) return;
        try {
            await axios.post(
                "http://localhost:8080/api/import/save",
                { parsed: result }
            );
            alert("Saved to database!");
        } catch (err) {
            alert(
                "Save failed: " +
                (err.response?.data?.error || err.message || "Unknown error")
            );
        }
    }

    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Import From URL</h2>

            <input
                className="w-full bg-slate-800 px-3 py-2 rounded mb-3"
                placeholder="https://kprofiles.com/itzy-members-profile/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button
                onClick={handleImport}
                className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Scraping..." : "Import"}
            </button>

            {error && <p className="text-red-400 mt-2">{error}</p>}

            {result && (
                <div className="mt-4 bg-slate-800 p-3 rounded text-xs whitespace-pre-wrap">
                    <h3 className="font-bold">Parsed Result</h3>
                    <textarea
                        className="w-full h-64 bg-slate-900 mt-2 p-2 rounded"
                        value={JSON.stringify(result, null, 2)}
                        onChange={(e) => {
                            try {
                                setResult(JSON.parse(e.target.value));
                            } catch {
                                // ignore JSON parse errors
                            }
                        }}
                    />
                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 mt-3 py-2 rounded"
                    >
                        Save to Database
                    </button>
                </div>
            )}
        </div>
    );
}

export default UrlImportPanel;
