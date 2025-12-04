import { useNavigate } from "react-router-dom";

export default function GroupSelector({ groups }) {
    const navigate = useNavigate();

    return (
        <div className="w-40 bg-slate-900 text-white p-4 flex flex-col gap-3">
            {groups.map((g) => (
                <button
                    key={g.id}
                    className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700"
                    onClick={() => navigate(`/groups/${g.id}`)}  // ⭐ 改這裡
                >
                    {g.name}
                </button>
            ))}
        </div>
    );
}

