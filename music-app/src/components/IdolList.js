import { useEffect, useState } from "react";
import api from "../api/client";

function IdolList() {
    const [idols, setIdols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api
            .get("/idols")
            .then((res) => {
                setIdols(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load idols");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-sm text-gray-400">Loading idols...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;

    return (
        <div className="mt-8">
            <h1 className="text-2xl font-bold mb-4">Idols</h1>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {idols.map((idol) => (
                    <div
                        key={idol.id}
                        className="p-3 rounded-xl border border-gray-200 bg-white"
                    >
                        <p className="font-semibold">
                            {idol.stage_name || idol.name}
                        </p>
                        {idol.group_name && (
                            <p className="text-xs text-gray-500 mt-1">
                                Group: {idol.group_name}
                            </p>
                        )}
                        {idol.position && (
                            <p className="text-xs text-gray-400 mt-1">
                                Position: {idol.position}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IdolList;
