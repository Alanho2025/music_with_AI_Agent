import { useEffect, useState } from "react";
import { useSecureApi } from "../../api/secureClient";


export default function WatchHistoryList() {
    const api = useSecureApi();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/users/watch-history");
            const rows = Array.isArray(res.data) ? res.data : [];
            setItems(rows);
        } catch (err) {
            console.error("Failed to load watch history", err);
            setError("Failed to load watch history");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        try {
            await api.delete(`/users/watch-history/${id}`);
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch (err) {
            console.error("Failed to delete watch history item", err);
        }
    }
    if (loading) {
        return (
            <p className="text-sm text-slate-400">
                Loading watch history...
            </p>
        );
    }

    if (error) {
        return <p className="text-sm text-red-400">{error}</p>;
    }

    if (items.length === 0) {
        return (
            <p className="text-sm text-slate-400">
                No watch history yet. Play something in Music Player!
            </p>
        );
    }
    return (
        <div className="space-y-3">
            {items.map((i) => (
                <div key={i.id} className="flex items-center gap-4 mb-3">
                    {i.thumbnail_url && (
                        <img
                            src={i.thumbnail_url}
                            className="w-32 h-20 rounded object-cover"
                            alt={i.title}
                        />
                    )}
                    <div className="flex-1">
                        <p className="font-semibold">{i.title}</p>
                        <p className="text-xs text-slate-400">
                            {i.watched_at
                                ? new Date(i.watched_at).toLocaleString()
                                : ""}
                        </p>
                    </div>
                    <button
                        onClick={() => remove(i.id)}
                        className="text-xs px-2 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
