import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    // 取得 groups
    useEffect(() => {
        api.get("/groups")
            .then((res) => setGroups(res.data))
            .catch((err) => console.error("Failed to load groups", err));
    }, []);

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-6">Groups</h1>
            <p className="mb-4 opacity-70">
                All K-pop groups loaded from your PostgreSQL database.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                    <div
                        key={g.id}
                        onClick={() => navigate(`/groups/${g.id}`)}
                        className="
                            bg-slate-900 border border-slate-700 
                            p-6 rounded-xl 
                            cursor-pointer 
                            hover:bg-slate-800 
                            hover:border-slate-500
                            transition
                        "
                    >
                        <h2 className="text-xl font-semibold">{g.name}</h2>

                        {g.debut_date && (
                            <p className="opacity-70 mt-1">
                                Debut: {new Date(g.debut_date).toLocaleDateString("en-GB")}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
