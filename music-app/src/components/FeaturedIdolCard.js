import { useEffect, useState } from "react";
import api from "../api/client";

function FeaturedIdolCard() {
    const [idol, setIdol] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/idols")
            .then((res) => {
                const list = res.data || [];
                if (list.length > 0) {
                    // 隨機挑一個當 featured
                    const random = list[Math.floor(Math.random() * list.length)];
                    setIdol(random);
                }
            })
            .catch((err) => {
                console.error("Failed to load featured idol", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Featured Idol</h3>

            <div className="bg-slate-800 rounded-lg p-3 flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-sky-500" />

                <div>
                    {loading && (
                        <>
                            <p className="font-semibold text-sm">Loading...</p>
                            <p className="text-xs text-slate-400">Fetching idol data</p>
                        </>
                    )}

                    {!loading && idol && (
                        <>
                            <p className="font-semibold text-sm">
                                {idol.stage_name || idol.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                {idol.group_name ? `${idol.group_name}` : "K-pop Idol"}
                                {idol.position ? ` · ${idol.position}` : null}
                            </p>
                        </>
                    )}

                    {!loading && !idol && (
                        <>
                            <p className="font-semibold text-sm">No idol found</p>
                            <p className="text-xs text-slate-400">
                                Check your database seed for idols.
                            </p>
                        </>
                    )}
                </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
                This card is now powered by real data from PostgreSQL. Each refresh can
                highlight a different idol from your database.
            </p>
        </div>
    );
}

export default FeaturedIdolCard;