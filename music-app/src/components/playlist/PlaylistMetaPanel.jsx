// src/components/playlist/PlaylistMetaPanel.jsx
import React from 'react';

function PlaylistMetaPanel({
  playlistName,
  selectedPlaylistId,
  playlists,
  playlistsLoading,
  saving,
  saveLabel,
  playlistError,
  saveMessage,
  dirty,
  onNameChange,
  onSelectPlaylist,
  onSave,
}) {
  return (
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-slate-400">Playlist name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. LE SSERAFIM Starter Pack"
            className="rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs text-slate-400">Existing playlists</label>
          <select
            value={selectedPlaylistId ? String(selectedPlaylistId) : 'new'}
            onChange={(e) => onSelectPlaylist(e.target.value)}
            className="rounded-md bg-slate-900 border border-slate-700 px-2 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="new">+ New playlist</option>
            {playlistsLoading && <option disabled>Loading...</option>}
            {playlists.map((pl) => (
              <option key={pl.id} value={String(pl.id)}>
                {pl.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="self-end ml-auto px-4 py-2 rounded-md bg-pink-500 text-xs font-medium text-white hover:bg-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : saveLabel}
        </button>
      </div>

      {playlistError && (
        <p className="text-xs text-red-400 mt-1">{playlistError}</p>
      )}
      {saveMessage && !playlistError && (
        <p className="text-xs text-emerald-400 mt-1">{saveMessage}</p>
      )}
      {dirty && !saving && (
        <p className="text-[11px] text-amber-300 mt-1">
          You have unsaved changes.
        </p>
      )}
    </div>
  );
}

export default PlaylistMetaPanel;
