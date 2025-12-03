// src/hooks/wiki/useWikiAlbumImport.js
import { useState } from "react";
import { useWikiAlbumApi } from "../../api/wikiClient";

export function useWikiAlbumImport() {
    const { importAlbum } = useWikiAlbumApi();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function runImport({ group_id, title, country }) {
        if (!group_id || !title?.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const data = await importAlbum({
                group_id,
                title: title.trim(),
                country: country?.trim() || "",
            });

            setResult(data);
        } catch (err) {
            console.error("useWikiAlbumImport error", err);
            const msg =
                err.response?.data?.error || "Failed to import album from Wikipedia.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        result,
        error,
        runImport,
    };
}
