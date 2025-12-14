// src/components/admin/AlbumList.jsx
import React from 'react';

function AlbumList({ albums, selectedId, onSelect }) {
  return (
    <div className="w-72 border-r border-slate-800 pr-3 flex flex-col gap-3">
      {/* List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 mt-1">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onSelect(album.id)}
            className={`text-left px-3 py-2 rounded-lg text-xs border transition ${
              album.id === selectedId
                ? 'border-pink-500 bg-slate-800'
                : 'border-slate-700 bg-slate-900 hover:border-pink-400'
            }`}
          >
            <p className="font-semibold text-slate-50">{album.title}</p>
            <p className="text-[11px] text-slate-400">{album.group_name}</p>
            {album.release_date && (
              <p className="text-[11px] text-slate-500">
                {new Date(album.release_date).toLocaleDateString('en-GB')}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AlbumList;
