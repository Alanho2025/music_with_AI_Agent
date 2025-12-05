// src/components/idols/FeaturedIdolCard.jsx
import { useEffect, useState } from "react";
import api from "../../api/client";

function Avatar({ idol }) {
    const src = idol.image_url || idol.profile_image || null;

    if (!src) {
        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-sky-500" />
        );
    }

    return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
            <img
                src={src}
                alt={idol.stage_name || idol.name}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

function FeaturedIdolCard() {
    const [idols, setIdols] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        api
            .get("/idols/featured")
            .then((res) => {
                const data = res.data;

                // 後端現在回陣列，但保險一點做處理
                const list = Array.isArray(data)
                    ? data
                    : data
                        ? [data]
                        : [];

                setIdols(list);
            })
            .catch((err) => {
                console.error("Failed to load featured idols", err);
                setIdols([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Featured idols</h3>

            <div className="bg-slate-800 rounded-lg p-3 flex flex-col gap-3">
                {loading && (
                    <p className="text-xs text-slate-400">Loading idols...</p>
                )}

                {!loading && idols.length === 0 && (
                    <div>
                        <p className="font-semibold text-sm">No idols found</p>
                        <p className="text-xs text-slate-400">
                            Check your database seed for idols.
                        </p>
                    </div>
                )}

                {!loading &&
                    idols.map((idol) => (
                        <div
                            key={idol.id}
                            className="flex items-center gap-3 py-1"
                        >
                            <Avatar idol={idol} />
                            <div className="flex flex-col">
                                <p className="font-semibold text-sm">
                                    {idol.stage_name || idol.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {idol.group_name || "K-pop Idol"}
                                    {idol.position ? ` · ${idol.position}` : ""}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
                This card is powered by the <code>/idols/featured</code>{" "}
                endpoint. Each refresh can highlight up to three different
                idols from your database.
            </p>
        </div>
    );
}

export default FeaturedIdolCard;
