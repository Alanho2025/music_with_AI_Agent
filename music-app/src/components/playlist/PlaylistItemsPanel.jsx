// src/components/playlist/PlaylistItemsPanel.jsx
import React from 'react';
import { getGroupName } from '../../hooks/useVideoLibrary';

function PlaylistItemsPanel({
  playlistItems,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDragOver,
  onDrop,
}) {
  return (
    <div
      className="bg-slate-950 rounded-lg p-4 border border-slate-800 flex-1 flex flex-col"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-100">
          Tracks in this playlist
        </h2>
        <span className="text-[11px] text-slate-500">
          {playlistItems.length} tracks
        </span>
      </div>

      {playlistItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-700 rounded-md">
          Drag videos from the left or press + to add them here.
        </div>
      ) : (
        <ul className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {playlistItems.map((item, index) => {
            const v = item.video;
            const groupName = getGroupName(v);
            return (
              <li key={`${item.video_id}-${index}`}>
                <div className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                  <span className="w-6 text-slate-500">{index + 1}.</span>
                  <div className="flex-1 flex flex-col">
                    <span className="text-slate-100">
                      {v?.title || 'Untitled'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {groupName && `${groupName} · `}
                      {v?.category || 'video'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onMoveUp(index)}
                      className="px-2 py-0.5 rounded-md border border-slate-700 text-[10px] hover:bg-slate-800"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown(index)}
                      className="px-2 py-0.5 rounded-md border border-slate-700 text-[10px] hover:bg-slate-800"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="ml-2 px-2 py-1 rounded-md border border-slate-700 text-[10px] text-red-300 hover:bg-red-900/40"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PlaylistItemsPanel;
