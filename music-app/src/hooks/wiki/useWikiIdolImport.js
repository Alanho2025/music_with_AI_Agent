// src/hooks/wiki/useWikiIdolImport.js
import { useState } from "react";
import { useWikiIdolApi } from "../../api/wikiClient";

export function useWikiIdolImport() {
    const { importIdol } = useWikiIdolApi();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function runImport({
        group_id,
        pageTitle,
        stage_name,
        korean_name,
        position,
    }) {
        if (!group_id || !pageTitle?.trim()) return;

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const data = await importIdol({
                group_id,
                pageTitle: pageTitle.trim(),
                stage_name: stage_name?.trim() || "",
                korean_name: korean_name?.trim() || "",
                position: position?.trim() || "",
            });

            setResult(data);
        } catch (err) {
            console.error("useWikiIdolImport error", err);
            const msg =
                err.response?.data?.error || "Failed to import idol from Wikipedia.";
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
