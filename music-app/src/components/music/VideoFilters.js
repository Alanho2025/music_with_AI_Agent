// src/components/music/VideoFilters.js
import React from "react";

function VideoFilters({
    searchTerm,
    onSearchChange,
    groups,
    groupFilter,
    onGroupChange,
    sortBy,
    sortDirection,
    onSortByChange,
    onSortDirectionToggle,
}) {
    const groupTags = ["All groups", ...groups];
    const sortLabel = sortDirection === "asc" ? "A-Z" : "Z-A";

    return (
        <>
            {/* 搜尋列 */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by title, group, tags..."
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
            </div>

            {/* Tag + 排序 */}
            <div className="flex items-center gap-2 mt-1">
                {/* group tags */}
                <div className="flex flex-wrap gap-2">
                    {groupTags.map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => onGroupChange(g)}
                            className={`px-3 py-1 rounded-full text-xs border ${groupFilter === g
                                    ? "bg-pink-500 text-white border-pink-500"
                                    : "bg-slate-950 text-slate-300 border-slate-700 hover:border-pink-400 hover:text-pink-200"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                {/* 排序控制：靠右 */}
                <div className="ml-auto flex items-center gap-2 text-xs">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    >
                        <option value="title">Title</option>
                        <option value="group">Group</option>
                    </select>

                    <button
                        type="button"
                        onClick={onSortDirectionToggle}
                        className="px-2 py-1 rounded-md border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                    >
                        {sortLabel}
                    </button>
                </div>
            </div>
        </>
    );
}

export default VideoFilters;
