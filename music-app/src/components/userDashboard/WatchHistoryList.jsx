import { useEffect, useState } from "react";
import { useSecureApi } from "../../api/secureClient";

export default function WatchHistoryList() {
    const api = useSecureApi();
    const [items, setItems] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const res = await api.get("/users/watch-history");
        setItems(res.data);
    }

    async function remove(id) {
        await api.delete(`/users/watch-history/${id}`);
        load();
    }

    return (
        <div>
            {items.map(i => (
                <div key={i.id} className="flex items-center gap-4 mb-3">
                    <img src={i.thumbnail_url} className="w-32 rounded" />
                    <div className="flex-1">
                        <p className="font-semibold">{i.title}</p>
                        <p className="text-xs text-slate-400">{i.watched_at}</p>
                    </div>
                    <button
                        onClick={() => remove(i.id)}
                        className="text-red-400">
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}
