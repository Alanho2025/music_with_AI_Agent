import { useEffect, useState } from "react";
import api from "../../api/client";

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api
            .get("/groups")
            .then((res) => {
                setGroups(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load groups");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-sm text-gray-400">Loading groups...</p>;
    if (error) return <p className="text-sm text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Groups</h1>
            <div className="grid gap-4 md:grid-cols-3">
                {groups.map((g) => (
                    <div
                        key={g.id}
                        className="p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="text-lg font-semibold">{g.name}</h2>
                        {g.agency && (
                            <p className="text-sm text-gray-500 mt-1">{g.agency}</p>
                        )}
                        {g.debut_date && (
                            <p className="text-xs text-gray-400 mt-1">
                                Debut: {new Date(g.debut_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupList;