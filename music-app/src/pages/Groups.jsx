// src/pages/Groups.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useSecureApi } from "../api/secureClient";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [viewMode, setViewMode] = useState("card"); // "card" | "list"
    const [followMap, setFollowMap] = useState({});   // { [groupId]: { notify: boolean } }
    const [loadingFollows, setLoadingFollows] = useState(false);

    const navigate = useNavigate();
    const secureApi = useSecureApi();

    // 取得 groups (公開)
    useEffect(() => {
        api.get("/groups")
            .then((res) => setGroups(res.data))
            .catch((err) => console.error("Failed to load groups", err));
    }, []);

    // 取得目前使用者追蹤的 groups
    useEffect(() => {
        async function loadFollows() {
            try {
                setLoadingFollows(true);
                const res = await secureApi.get("/users/follow-groups");
                const rows = Array.isArray(res.data) ? res.data : [];
                const map = {};
                rows.forEach((r) => {
                    map[r.group_id] = { notify: r.notify };
                });
                setFollowMap(map);
            } catch (err) {
                // 沒登入時這裡可能 401，就先忽略
                console.warn("Failed to load follow groups", err);
            } finally {
                setLoadingFollows(false);
            }
        }

        loadFollows();
    }, []);

    const isFollowing = (groupId) => !!followMap[groupId];

    async function toggleFollow(e, groupId) {
        e.stopPropagation(); // 不要觸發卡片的 navigate

        const currentlyFollowing = isFollowing(groupId);

        try {
            if (currentlyFollowing) {
                await secureApi.delete(`/users/follow-groups/${groupId}`);
                setFollowMap((prev) => {
                    const next = { ...prev };
                    delete next[groupId];
                    return next;
                });
            } else {
                await secureApi.post("/users/follow-groups", {
                    group_id: groupId,
                    notify: true,
                });
                setFollowMap((prev) => ({
                    ...prev,
                    [groupId]: { notify: true },
                }));
            }
        } catch (err) {
            console.error("Failed to toggle follow group", err);
        }
    }

    function renderSubscribeBadge(groupId) {
        const following = isFollowing(groupId);

        return (
            <button
                onClick={(e) => toggleFollow(e, groupId)}
                disabled={loadingFollows}
                className={`text-xs px-3 py-1 rounded-full border 
                    ${following
                        ? "border-emerald-400 text-emerald-300 bg-emerald-400/10"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                    transition
                `}
            >
                {following ? "Following" : "Subscribe"}
            </button>
        );
    }

    function renderCardView() {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                    <div
                        key={g.id}
                        onClick={() => navigate(`/groups/${g.id}`)}
                        className="
                        relative overflow-hidden
                        rounded-xl cursor-pointer
                        border border-slate-700
                        hover:border-slate-500
                        transition
                        group hover:shadow-lg
                    "
                        style={{
                            backgroundImage: `url(${g.group_img_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* 黑色漸層罩層，確保文字可讀 */}
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition"></div>

                        <div className="relative p-6 flex flex-col justify-between h-60">
                            <div>
                                <h2 className="text-xl font-semibold text-white drop-shadow">
                                    {g.name}
                                </h2>
                                <p className="opacity-80 mt-1 text-sm text-white">
                                    {g.fanclub_name ? `${g.fanclub_name} · Since ${new Date(g.debut_date).getFullYear()}`
                                        : `Since ${new Date(g.debut_date).getFullYear()}`}
                                </p>
                            </div>

                            <div className="flex justify-end z-10">
                                {renderSubscribeBadge(g.id)}
                            </div>
                        </div>
                </div>
                ))}
            </div>
        );
    }

    function renderListView() {
        return (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl">
                {/* 表頭 */}
                <div className="grid grid-cols-[1.5fr,1.3fr,1.6fr,0.8fr,auto] px-6 py-3 text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                    <span>Group</span>
                    <span>Fanclub</span>
                    <span>Company</span>
                    <span className="text-center">Members</span>
                    <span className="text-right">Follow</span>
                </div>

                {/* 列表 */}
                <div className="divide-y divide-slate-800">
                    {groups.map((g) => (
                        <div
                            key={g.id}
                            onClick={() => navigate(`/groups/${g.id}`)}
                            className="grid grid-cols-[1.5fr,1.3fr,1.6fr,0.8fr,auto] px-6 py-4 text-sm hover:bg-slate-800/60 cursor-pointer"
                        >
                            {/* Group 名稱 + Debut 年份小字 */}
                            <div className="flex flex-col">
                                <span className="font-medium">{g.name}</span>
                                <span className="text-xs text-slate-400">
                                    {g.debut_date
                                        ? `Since ${new Date(
                                            g.debut_date
                                        ).getFullYear()}`
                                        : ""}
                                </span>
                            </div>

                            {/* Fanclub 名稱 */}
                            <div className="text-slate-200">
                                {g.fanclub_name || "—"}
                            </div>

                            {/* Company */}
                            <div className="text-slate-300">
                                {g.company || "—"}
                            </div>

                            {/* Members 數量 */}
                            <div className="text-center text-slate-200">
                                {g.members_count ?? "—"}
                            </div>

                            {/* Follow 按鈕 */}
                            <div className="flex justify-end">
                                {renderSubscribeBadge(g.id)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }     
    return (
        <div className="p-10 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Groups</h1>
                    <p className="mt-1 opacity-70 text-sm">
                        All your favorite groups, right here. 💫
                    </p>
                </div>

                {/* View toggle */}
                <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full p-1 text-xs">
                    <button
                        onClick={() => setViewMode("card")}
                        className={`px-3 py-1 rounded-full ${viewMode === "card"
                                ? "bg-slate-700 text-white"
                                : "text-slate-300"
                            }`}
                    >
                        Cards
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1 rounded-full ${viewMode === "list"
                                ? "bg-slate-700 text-white"
                                : "text-slate-300"
                            }`}
                    >
                        List
                    </button>
                </div>
            </div>

            {viewMode === "card" ? renderCardView() : renderListView()}
        </div>
    );
}
