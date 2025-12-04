// src/components/music/PlaylistFilters.js
import React from "react";

export default function PlaylistFilters({
    playlists,
    playlistFilter,
    onPlaylistChange,
}) {
    if (!playlists || playlists.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {playlists.map((pl) => (
                <button
                    key={pl.id}
                    onClick={() => onPlaylistChange(pl.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${playlistFilter === pl.id
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-slate-950 text-slate-300 border-slate-700 hover:border-indigo-400 hover:text-indigo-200"
                        }`}
                >
                    {pl.name}
                </button>
            ))}
        </div>
    );
}
