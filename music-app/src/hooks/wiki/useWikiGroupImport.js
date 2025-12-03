// src/hooks/wiki/useWikiGroupImport.js
import { useState } from "react";
import { useWikiGroupApi } from "../../api/wikiClient";

export function useWikiGroupImport() {
    const { importGroup } = useWikiGroupApi();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function runImport({ title, korean_name, gender }) {
        if (!title || !title.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const data = await importGroup({
                title: title.trim(),
                korean_name: korean_name?.trim() || "",
                gender: gender || "",
            });

            setResult(data);
        } catch (err) {
            console.error("useWikiGroupImport error", err);
            const msg =
                err.response?.data?.error || "Failed to import group from Wikipedia.";
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
